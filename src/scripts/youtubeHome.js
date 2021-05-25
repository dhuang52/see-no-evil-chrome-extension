// import "regenerator-runtime/runtime.js"
import { getAllVideosOnHomePage, getVideoTitle, getVideoChannel } from './utils/youtube'
import BlurScript from './utils/BlurScript'

console.log('youtube home injected')

class YouTubeHomeBlurScript extends BlurScript {
  constructor() {
    super()
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

  handleBlur() {
    console.log('YouTubeHomeBlurScript handleblur')
    if (this.hideList) {
      const videoMetaDataList = this.getAllVideoMetaData()
      console.log(videoMetaDataList, this.hideList)
    } else {
      this.initHideListAndHandleBlur()
    }
  }
}

new YouTubeHomeBlurScript()