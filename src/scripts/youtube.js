import {isVideoNode,
  isVideoMetaDataNode,
  getAllVideoNodes,
  getPageManager,
  getChannelName,
  getVideoTitle,
  getVideoNodeParent} from './utils/youtube'
import Fuse from 'fuse.js'
import '../styles/blur.css'

let hideWordList = []
const HIDE_WORDS_LIST_STORAGE_KEY = 'hideWords'
const BLUR_LAYER_CLASS = 'sne-blur-layer'
const FUSE = new Fuse([], {
  includeScore: true,
  threshold: .3
})

chrome.storage.sync.get(HIDE_WORDS_LIST_STORAGE_KEY, (result) => {
  if (chrome.runtime.lastError) {
    // TODO: display error message to user
    console.log('error while getting hide words', chrome.runtime.lastError)
  } else if (result[HIDE_WORDS_LIST_STORAGE_KEY]) {
    hideWordList = result[HIDE_WORDS_LIST_STORAGE_KEY]
    // Manually trigger an update to the DOM since the MutationObserver might not catch all events when the page first loads
    const allVideoNodes = getAllVideoNodes()
    updateDOM(allVideoNodes)
  }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  // Update local copy of hideWords if there was a new value
  if (namespace === 'sync' && changes[HIDE_WORDS_LIST_STORAGE_KEY]?.newValue) {
    hideWordList = changes[HIDE_WORDS_LIST_STORAGE_KEY].newValue
    // Manually trigger an update to the DOM since the MutationObserver does not catch storage API events
    const allVideoNodes = getAllVideoNodes()
    updateDOM(allVideoNodes)
  }
});

const initializeMutationObserver = () => {
  const mutationObserver = new MutationObserver(mutationObserverCallback)
  const ytdPageManager = getPageManager()
  const mutationObserverOptions = {
    subtree: true,
    childList: true
  }
  mutationObserver.observe(ytdPageManager, mutationObserverOptions)
}

const mutationObserverCallback = (mutationList) => {
  // Find all added nodes that are videos
  const relevantAddedNodes = mutationList.flatMap(mutationRecord => [...mutationRecord.addedNodes]).filter(isVideoNode)
  // Find all video nodes that were updated (i.e. the video title changed)
  const relevantUpdatedNodes = mutationList.filter(mutationRecord => isVideoMetaDataNode(mutationRecord.target))
    .map(mutationRecord => getVideoNodeParent(mutationRecord.target))
    .filter(node => node)

  // Convert to set to remove duplicate nodes
  const relevantNodesSet = new Set([...relevantUpdatedNodes, ...relevantAddedNodes])
  updateDOM([...relevantNodesSet])
}

const updateDOM = (nodes) => {
  nodes.forEach(node => nodeMetaDataSimilarToHideWord(node) ? blurNode(node) : unblurNode(node))
}

const nodeMetaDataSimilarToHideWord = (node) => {
  const channelName = getChannelName(node)
  const videoTitle = getVideoTitle(node)
  FUSE.setCollection([channelName, videoTitle])
  const hideWordMatches = hideWordList.flatMap(hideWord => FUSE.search(hideWord.word))
  return hideWordMatches.length
}

const blurNode = (node) => {
  if (!node.classList.contains(BLUR_LAYER_CLASS)) {
    node.classList.add(BLUR_LAYER_CLASS)
  }
}

const unblurNode = (node) => {
  node.classList.remove(BLUR_LAYER_CLASS)
}

initializeMutationObserver()