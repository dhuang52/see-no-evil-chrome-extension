import urlFilters from '../constants/urlFilters'

// YouTube home page
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  console.log('YouTube home')
  const tabId = details.tabId
  chrome.scripting.executeScript({
    target: {tabId},
    files: ['youtubeHome.bundle.js']
  })
}, urlFilters.youtubeHome)

// YouTube watch page
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('YouTube Watch')
  const tabId = details.tabId
}, urlFilters.youtubeWatch)

// YouTube channel page
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('YouTube Channel')
  const tabId = details.tabId
}, urlFilters.youtubeChannel)