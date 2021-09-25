const VIDEO_NODE_TAG_NAMES = [
  'ytd-rich-item-renderer',
  'ytd-compact-video-renderer',
  'ytd-video-renderer',
  'ytd-grid-video-renderer',
];

const getChannelName = (videoNode) => videoNode.querySelector('#channel-name #text-container')?.textContent.trim() || '';

const getVideoTitle = (videoNode) => videoNode.querySelector('#video-title')?.textContent.trim() || '';

const getPageManager = () => document.querySelector('ytd-page-manager#page-manager');

const isAdRenderer = (node) => node.querySelector('ytd-display-ad-renderer');

const isVideoNode = (node) => node.tagName
  && VIDEO_NODE_TAG_NAMES.includes(node.tagName.toLowerCase())
  && !isAdRenderer(node);

const isVideoMetaDataNode = (node) => node.id === 'video-title' || node.id === 'channel-name';

const getVideoNodeParent = (childNode) => {
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

const getAllVideoNodes = () => {
  let nodes = [];
  VIDEO_NODE_TAG_NAMES.forEach((tagName) => {
    nodes = nodes.concat([...document.querySelectorAll(tagName)]);
  });
  return nodes;
};

export default {
  getChannelName,
  getVideoTitle,
  getPageManager,
  isAdRenderer,
  isVideoNode,
  isVideoMetaDataNode,
  getVideoNodeParent,
  getAllVideoNodes,
};
