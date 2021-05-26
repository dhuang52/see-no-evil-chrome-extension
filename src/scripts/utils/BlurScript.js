import Fuse from 'fuse.js'
import '../../styles/blur.css'

/**
 * Base class for content scripts that blur the contents on the page based off the hide list
 */
export default class BlurScript {
  constructor() {
    // Would be nice to have dynamic threshold dependent on the difference in length between the hide 
    // word and search pattern
    //    ex: threshold = Math.abs(hideWord.length - pattern.length) / Math.max(ideWord.length, pattern.length)
    // Fuse and other fuzzy search libraries do not support this feature yet.
    // 0 = exact match, 1 = match anything
    const threshold = .4
    const objKeys = ['word']
    this.fuse = new Fuse([], {
      keys: objKeys,
      ignoreLocation: true,
      includeScore: true,
      threshold
    })

    this.storageKey = 'hideWords'
    this.hideList
    this.initListener()
  }

  /**
   * Blur content. Implementation left up to child class.
   * Not meant to be called outside the class.
   */
  _blur() {
    console.log('Child class has no implementation for blur() yet')
  }

  handleBlur() {
    if (this.hideList) {
      this.fuse.setCollection(this.hideList)
      this._blur()
    } else {
      this.initHideListAndHandleBlur()
    }
  }

  /**
   * Initialize listener storage API
   */
  initListener = () => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      // Update local copy of hideWords if there was a new value
      if (namespace === 'sync' && changes[this.storageKey]?.newValue) {
        this.hideList = changes[this.storageKey].newValue
        console.log(this.hideList)
        this.handleBlur()
      }
    });
  }

  /**
   * Initialize the in memory hide list and call handleBlur
   */
  initHideListAndHandleBlur() {
    chrome.storage.sync.get(this._storageKey, (result) => {
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words', chrome.runtime.lastError)
      } else if (result[this.storageKey]) {
        this.hideList = result[this.storageKey]
        this.handleBlur()
      }
      // if at this point, then user hasn't added any words to the hide list
    })
  }
}