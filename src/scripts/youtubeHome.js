import { getAllVideosOnHomePage, getVideoTitle, getVideoChannel } from './utils/youtube'

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
    console.log(videoChannel, videoTitle)
    videoMetaDataList.push({
      videoChannel,
      videoTitle
    })
  }
}

 handleBlur = (hideListManager) => {
  videoMetaDataList = getAllVideoMetaData()
}