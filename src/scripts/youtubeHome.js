// import "regenerator-runtime/runtime.js"
import { getAllVideosOnHomePage, getVideoTitle, getVideoChannel } from './utils/youtube'
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

  /**
   * Returns true if videoMetaData contains text similar to a word in the hide list.
   * Leverage Fuse fuzzy search to determine similarity (configured in BlurScript).
   * @param videoMetaData 
   * @returns true if meta data is similar to a word in the hide list, false otherwise
   */
  _filter(videoMetaData) {
    const videoChannel = videoMetaData.videoChannel
    const videoTitle = videoMetaData.videoTitle
    const videoChannelLikeHideWord = this.fuse.search(videoChannel)
    const videoTitleLikeHideWord = this.fuse.search(videoTitle)
    return videoChannelLikeHideWord.length || videoTitleLikeHideWord.length
  }

  _injectInlineBlurStyle(ytdRichItemRenderer) {
    const content = ytdRichItemRenderer.querySelector('#content')
    content.className = `${content.className} ${this.blurLayerClass}`
  }

  _blur() {
    console.log('YouTube home blur')
    const videoMetaDataList = this.getAllVideoMetaData()
    console.log('hideList', this.hideList)
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