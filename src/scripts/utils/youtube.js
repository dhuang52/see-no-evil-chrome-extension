const VIDEO_NODE_TAG_NAMES = ['ytd-rich-item-renderer',
  'ytd-compact-video-renderer',
  'ytd-video-renderer',
  'ytd-grid-video-renderer',
];

export const getChannelName = (videoNode) => videoNode.querySelector('#channel-name #text-container')?.textContent.trim() || '';

export const getVideoTitle = (videoNode) => videoNode.querySelector('#video-title')?.textContent.trim() || '';

export const getPageManager = () => document.querySelector('ytd-page-manager#page-manager');

export const isAdRenderer = (node) => node.querySelector('ytd-display-ad-renderer');

export const isVideoNode = (node) => node.tagName
  && VIDEO_NODE_TAG_NAMES.includes(node.tagName.toLowerCase())
  && !isAdRenderer(node);

export const isVideoMetaDataNode = (node) => node.id === 'video-title' || node.id === 'channel-name';

export const getVideoNodeParent = (childNode) => {
  let videoNode = null;
  for (let i = 0; i < VIDEO_NODE_TAG_NAMES.length; i += 1) {
    const tagName = VIDEO_NODE_TAG_NAMES[i];
    videoNode = childNode.closest(tagName);
    if (videoNode) {
      break;
    }
  }
  return videoNode;
};

export const getAllVideoNodes = () => {
  let nodes = [];
  VIDEO_NODE_TAG_NAMES.forEach((tagName) => {
    nodes = nodes.concat([...document.querySelectorAll(tagName)]);
  });
  return nodes;
};
