/**
 * Base class for content scripts that blur the contents on the page based off the hide list
 */
export default class BlurScript {
  constructor() {
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
        reject(chrome.runtime.lastError)
      } else if (result[this.storageKey]) {
        this.hideList = result[this.storageKey]
        this.handleBlur()
      }
      // if at this point, then user hasn't added any words to the hide list
    })
  }
}