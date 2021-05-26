// import "regenerator-runtime/runtime.js"
import { getAllVideosOnHomePage, getVideoTitle, getVideoChannel, getContent } from './utils/youtube'
import BlurScript from './utils/BlurScript'

console.log('youtube home injected')

class YouTubeHomeBlurScript extends BlurScript {
  constructor() {
    super()
    this.blurLayerClass = 'sne-blur-layer'
  }

  getAllVideoMetaData = () => {
    const videoMetaDataList = []
    const ytdRichItemRendererList = getAllVideosOnHomePage()
    for(let i = 0; i < ytdRichItemRendererList.length; i++) {
      const ytdRichItemRenderer = ytdRichItemRendererList[i]
      const videoMetaData = ytdRichItemRenderer.querySelector('#content ytd-rich-grid-media #dismissible #details #meta')
      if (!videoMetaData) {
        continue
      }
      const videoChannel = getVideoChannel(videoMetaData)
      const videoTitle = getVideoTitle(videoMetaData)
      videoMetaDataList.push({
        videoChannel,
        videoTitle,
        dom: ytdRichItemRenderer
      })
    }
    return videoMetaDataList
  }

  _cleanBlurredElements() {
    // find hideWords in blurredElements that are not in hideList retrieved from storage API and
    // remove the blur class from the dom elements
    const difference = Object.entries(this.blurredElements).filter(entry => !this.hideList.includes(entry[0]))
    const domElements = difference.map(entry => entry[1])
    const hideWords = difference.map(entry => entry[0])
    domElements.forEach(domElementList => {
      domElementList.forEach(domElement => {
        const content = getContent(domElement)
        // split by space, and remove last class name (the blur class)
        const originalClassName = content.className.split(' ').slice(0, -1).join(' ')
        content.className = originalClassName
      })
    })
    hideWords.forEach(hideWord => delete this.blurredElements[hideWord])
  }

  /**
   * Returns true if videoMetaData contains text similar to a word in the hide list.
   * Leverage Fuse fuzzy search to determine similarity (configured in BlurScript).
   * @param videoMetaData 
   * @returns true if meta data is similar to a word in the hide list, false otherwise
   */
  _filter(videoMetaData) {
    const videoChannel = videoMetaData.videoChannel
    const videoTitle = videoMetaData.videoTitle
    const videoChannelLikeHideWords = this.fuse.search(videoChannel)
    const videoTitleLikeHideWords = this.fuse.search(videoTitle)
    const match = videoChannelLikeHideWords.length || videoTitleLikeHideWords.length
    
    this._updateBlurredElementsList(videoChannelLikeHideWords.map(fuseItem => fuseItem.item.word), videoMetaData.dom)
    this._updateBlurredElementsList(videoTitleLikeHideWords.map(fuseItem => fuseItem.item.word), videoMetaData.dom)

    return match
  }

  _injectInlineBlurStyle(ytdRichItemRenderer) {
    const content = getContent(ytdRichItemRenderer)
    content.className = `${content.className} ${this.blurLayerClass}`
  }

  _blur() {
    const videoMetaDataList = this.getAllVideoMetaData()
    // filter videoMetaDataList if hide list contains words in videoChannel and videoTitle
    const filteredVideoMetaDataList = videoMetaDataList.filter(this._filter, this)
    console.log('filteredVideoMetaDataList', filteredVideoMetaDataList)
    // apply blur class to dom elements in videoMetaDataList
    filteredVideoMetaDataList.forEach(videoMetaData => {
      this._injectInlineBlurStyle(videoMetaData.dom)
    })
  }
}

new YouTubeHomeBlurScript().handleBlur()