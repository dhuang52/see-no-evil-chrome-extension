import { contentRootQuerySelector, videoTagName, videoMetaDataQuerySelector } from '../../constants/sortBy'

export const getChannelName = (videoNode) => {
  return videoNode.querySelector('#channel-name #text-container').textContent.trim()
}

export const getVideoTitle = (videoNode) => {
  return videoNode.querySelector('#video-title').textContent.trim()
}

export const getContent = (ytdRichItemRenderer) => {
  return ytdRichItemRenderer.querySelector('#content')
}

export const getContentRoot = (pageType) => {
  const query = contentRootQuerySelector[pageType]
  return document.querySelector(query)
}

export const getAllVideosOnPage = (pageType) => {
  const contentRoot = getContentRoot(pageType)
  console.log(pageType, videoTagName[pageType])
  if (!contentRoot) {
    return []
  }
  const nodeList = Array.apply(null, contentRoot.getElementsByTagName(videoTagName[pageType]))
  return nodeList.filter(node => !node.querySelector('ytd-display-ad-renderer'))
}

export const getAllVideoMetaDataOnPage = (pageType) => {
  const videoMetaDataList = []
  const ytdRichItemRendererList = getAllVideosOnPage(pageType)
  for(let i = 0; i < ytdRichItemRendererList.length; i++) {
    const ytdRichItemRenderer = ytdRichItemRendererList[i]
    const videoMetaData = ytdRichItemRenderer.querySelector(videoMetaDataQuerySelector[pageType])
    if (!videoMetaData) {
      continue
    }
    const videoChannel = getChannelName(videoMetaData)
    const videoTitle = getVideoTitle(videoMetaData)
    videoMetaDataList.push({
      videoChannel,
      videoTitle,
      dom: ytdRichItemRenderer
    })
  }
  return videoMetaDataList
}