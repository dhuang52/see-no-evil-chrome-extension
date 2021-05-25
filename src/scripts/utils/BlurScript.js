/**
 * Base class for content scripts that blur the contents on the page
 */
export default class BlurScript {
  constructor() {
    this.storageKey = 'hideWords'
    this.hideList
    this.initListener()
  }

  /**
   * Blur content. Implementation left up to child class.
   */
  handleBlur() {
    console.log('Child class has no implementation for handleBlur yet')
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
   * Initialize the in memory hide list and call handle blur
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