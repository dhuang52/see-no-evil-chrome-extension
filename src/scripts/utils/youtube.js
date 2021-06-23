import { contentRootQuerySelector, videoTagName, videoMetaDataQuerySelector } from '../../constants/sortBy'

export const getChannelName = (videoNode) => {
  return videoNode.querySelector('#channel-name #text-container').textContent.trim()
}

export const getVideoTitle = (videoNode) => {
  return videoNode.querySelector('#video-title').textContent.trim()
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