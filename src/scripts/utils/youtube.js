export const getYouTubeHomeContentRoot = () => {
  return document.getElementById('contents')
}

const getAllVideosOnHomePage = () => {
  const contentRoot = getYouTubeHomeContentRoot()
  return contentRoot.getElementsByTagName('ytd-rich-item-renderer')
}

const getVideoChannel = (videoMetaData) => {
  return videoMetaData.querySelector('#channel-name').querySelector('#text-container').textContent.trim()
}

const getVideoTitle = (videoMetaData) => {
  return videoMetaData.querySelector('#video-title').textContent.trim()
}

export const getContent = (ytdRichItemRenderer) => {
  return ytdRichItemRenderer.querySelector('#content')
}

export const getAllVideoMetaDataOnHomePage = () => {
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