// import "regenerator-runtime/runtime.js"
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
    // track the blurred elements for easy removal
    //  blurredElements[hideWord] = domElement
    this.blurredElements = {}
    this.initListener()
  }

  /**
   * Given a list of hide words and a DOM element that is blurred, update the blurredElements mappping so that
   * for each hide word in hideWords, blurredElements[hideWord] = DOM element
   * @param {*} hideWords list of hideWords
   * @param {*} domElement element on DOM that has been blurred
   */
  _updateBlurredElementsList(hideWords, domElement) {
    hideWords.forEach(hideWord => this.blurredElements[hideWord] ?
      this.blurredElements[hideWord].push(domElement) : this.blurredElements[hideWord] = [domElement])
  }

  /**
   * Unblur content. 
   */
  _cleanBlurredElements() {
    console.log('Child class has no implementation for _cleanBlurredElements() yet')
  }

  /**
   * Add class to content to apply blur css
   * @param {*} content DOM element that needs to be blurred
   */
  _injectInlineBlurStyle(content) {
    if (!content.className.includes(this.blurLayerClass)) {
      // TODO: use https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add instead
      content.className = `${content.className} ${this.blurLayerClass} `
    }
  }

  getNodes() {
    console.log('Child class has no implementation for getNodes() yet')
  }

  _parseNodes(nodes) {
    console.log('Child class has no implementation for _parseNodes() yet')
  }

  _filterParsedNodes(parsedNodes) {
    console.log('Child class has no implementation for _filterParsedNodes() yet')
  }

  updateDom(nodes) {
    if (this.hideList) {
      this.fuse.setCollection(this.hideList)
      this._cleanBlurredElements()

      const parsedNodes = this._parseNodes(nodes)
      const filteredNodes = this._filterParsedNodes(parsedNodes)
      this._blurNodes(filteredNodes)
    } else {
      this.initHideListAndUpdateDom()
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
        this.updateDom(this.getNodes())
      }
    });
  }

  /**
   * Initialize the in memory hide list and call updateDom
   */
  initHideListAndUpdateDom() {
    chrome.storage.sync.get(this._storageKey, (result) => {
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words', chrome.runtime.lastError)
      } else if (result[this.storageKey]) {
        this.hideList = result[this.storageKey]
        this.updateDom(this.getNodes())
      }
      // if at this point, then user hasn't added any words to the hide list
    })
  }
}