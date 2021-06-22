import { getAllVideoMetaDataOnPage, getContent, getAllVideosOnPage, getVideoTitle, getChannelName } from './utils/youtube'
import { videoTagName } from '../constants/sortBy'
import BlurScript from './utils/BlurScript'

console.log('youtube home injected')

class YouTubeHomeBlurScript extends BlurScript {
  constructor() {
    super()
    this.blurLayerClass = 'sne-blur-layer'
    this.videoMetaDataList = []
    // TODO: dynamically set
    this.pageType = 'watch'
    this._initContentObserver()
  }

  _initContentObserver() {
    const contentRoot = document.querySelector('ytd-page-manager')

    this.observer = new MutationObserver((mutations) => {
      const relevantNodes = []
      mutations.forEach(mutationRecord => {
        if (mutationRecord.addedNodes) {
          mutationRecord.addedNodes.forEach(addedNode => {
            if (addedNode.localName === videoTagName.home || addedNode.localName === videoTagName.watch) {
              relevantNodes.push(addedNode)
            }
          })
        }
      })

      if (relevantNodes.length) {
        console.log(relevantNodes)
        this.updateDom(relevantNodes)
      }
    })
    const mutationObserverOptions = {
      childList: true,
      subtree: true,
    }
    this.observer.observe(contentRoot, mutationObserverOptions)
  }

  getNodes() {
    return getAllVideosOnPage(this.pageType)
  }

  _parseNodes(nodes) {
    return nodes.map(node => ({
      channelName: getChannelName(node),
      videoTitle: getVideoTitle(node),
      node
    }))
  }

  _filterParsedNodes(parsedNodes) {
    return parsedNodes.filter(parsedNode => {
      const { channelName, videoTitle, node } = parsedNode 
      const hideWordMatches = [...this.fuse.search(channelName), ...this.fuse.search(videoTitle)].map(fuseItem => fuseItem.item.word)
      if (hideWordMatches.length) {
        this._updateBlurredElementsList(hideWordMatches, node)
        return true
      }
      return false
    })
  }

  _blurNodes(parsedNodes) {
    parsedNodes.forEach(parsedNode => {
      this._injectInlineBlurStyle(parsedNode.node)
    })
  }

  _cleanBlurredElements() {
    // find words in blurredElements that are not in hideList
    const hideWords = this.hideList.map(hideWord => hideWord.word)
    const removedHideWords = Object.keys(this.blurredElements).filter(hideWord => !hideWords.includes(hideWord))
    // get list of nodes that no longer need to be blurred
    const nodes = removedHideWords.reduce((nodes, hideWord) => nodes.concat(this.blurredElements[hideWord]), [])
    // remove blur from node
    nodes.forEach(node => node.classList.remove('sne-blur-layer'))
    // remove hide word from node map (ex: {hideWord: [nodes...]} -> {})
    removedHideWords.forEach(hideWord => delete this.blurredElements[hideWord])
  }
}

const blurScript = new YouTubeHomeBlurScript()
blurScript.updateDom(blurScript.getNodes())