import urlFilters from '../constants/urlFilters'

// YouTube home page
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  const tabId = details.tabId
  console.log('YouTube home')
}, urlFilters.youtubeHome)

// YouTube watch page
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('YouTube Watch')
}, urlFilters.youtubeWatch)

// YouTube channel page
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('YouTube Channel')
}, urlFilters.youtubeChannel)