/**
 * Singleton that all content scripts will use to retrieve the latest version of the hide words list 
 */
class HideListManager {
  constructor() {
    console.log('HideListManager')
    // TODO: make key less generic and move to a constants file
    this._storageKey = 'hideWords'
    this._initListener()
  }

  _initListener = () => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      // Update local copy of hideWords if there was a new value
      if (namespace === 'sync' && changes[this._storageKey]?.newValue) {
        this._hideList = changes[this._storageKey].newValue
        console.log(changes[this._storageKey])
      }
    });
  }

  /**
   * chrome.storage API asynchronously loads data.
   * @returns Promise
   */
  getHideListFromStorage = async () => {
    return new Promise((resolve, reject) => {
      if (this._hideList) {
        resolve(this._hideList)
      }
      chrome.storage.sync.get(this._storageKey, (result) => {
        if (chrome.runtime.lastError) {
          // TODO: display error message to user
          console.log('error while getting hide words', chrome.runtime.lastError)
          reject(chrome.runtime.lastError)
        } else if (result[this._storageKey]) {
          this._hideList = result[this._storageKey]
          resolve(this._hideList)
        }
      })
    })
  }
}

// Singleton pattern to avoid desyncs across content scipts and redundant read/listener operations
const hideListManager = new HideListManager()
export default hideListManager