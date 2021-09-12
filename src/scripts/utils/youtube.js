const VIDEO_NODE_TAG_NAMES = ['ytd-rich-item-renderer',
  'ytd-compact-video-renderer',
  'ytd-video-renderer',
  'ytd-grid-video-renderer'
]

export const getChannelName = (videoNode) => {
  return videoNode.querySelector('#channel-name #text-container')?.textContent.trim() || ''
}

export const getVideoTitle = (videoNode) => {
  return videoNode.querySelector('#video-title')?.textContent.trim() || ''
}

export const getPageManager = () => {
  return document.querySelector('ytd-page-manager#page-manager')
}

export const isAdRenderer = (node) => {
  return node.querySelector('ytd-display-ad-renderer')
}

export const isVideoNode = (node) => {
  return node.tagName && VIDEO_NODE_TAG_NAMES.includes(node.tagName.toLowerCase()) && !isAdRenderer(node)
}

export const isVideoMetaDataNode = (node) => {
  return node.id === 'video-title' || node.id === 'channel-name'
}

export const getVideoNodeParent = (childNode) => {
  let videoNode = null
  for (let tagName of VIDEO_NODE_TAG_NAMES) {
    videoNode = childNode.closest(tagName)
    if (videoNode) {
      break
    }
  }
  return videoNode
}

export const getAllVideoNodes = () => {
  let nodes = []
  VIDEO_NODE_TAG_NAMES.forEach(tagName => {
    nodes = nodes.concat([...document.querySelectorAll(tagName)])
  })
  return nodes
}