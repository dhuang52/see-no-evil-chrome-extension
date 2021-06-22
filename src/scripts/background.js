import { urlFilters, matchPatterns } from '../constants/filter'
import { youTubePage } from '../constants/sortBy'

// Event listners for: YouTube home
// YouTube home page visited from url
chrome.webRequest.onCompleted.addListener(details => {
  console.log('YouTubeHome: chrome.webRequest.onCompleted')
  const tabId = details.tabId
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['youtubeHome.bundle.js']
  })
}, {urls: [matchPatterns.youtube]})

// YouTube home page revisited
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  /**
   * If the YouTube home page and browse request listeners are both triggered, the logic in the home page
   * listener should be ignored. Below are the cases and the causes I've found so far.
   * Case 1: YouTube home page and browse request listeners are both triggered:
   *    1. Returning to the home page using the back button after a while (YouTube home page is no longer in cache)
   *    2. Clicking on YouTube home button (top left)
   * Case 2: Only Youtube home page listener is triggered:
   *    1. Returning to the home page using the back button (YouTube home page is still in cache)
   * Case 3: Only YouTube browse request listener is triggered:
   *    1. (none yet)
   * (Cases like refreshing on the home page, or visiting youtube.com will trigger static injection and none of the
   * listeners in this file)
   * The if statement below handles case 1.2 and 2.1 appropriately. There's no way to tell the difference between
   * case 1.1 and 2.1 though, so the logic in both listeners will have to be executed (could be repeated work).
   */
  if (details.transitionQualifiers.includes('forward_back')) {
    console.log('YouTubeHome: chrome.webNavigation.onHistoryStateUpdated')
    const tabId = details.tabId
    // chrome.scripting.executeScript({
    //   target: {tabId},
    //   files: ['youtubeHome.bundle.js']
    // })
  }
}, urlFilters.youtubeHome)

chrome.webRequest.onCompleted.addListener(details => {
  console.log('YouTubeWatch: chrome.webRequest.onCompleted')
  const tabId = details.tabId
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['youtubeHome.bundle.js']
  })
}, {urls: [matchPatterns.youtubeWatch]})

// Event listener for: YouTube watch
// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//   console.log('YouTube Watch')
//   const tabId = details.tabId
//   // chrome.tabs.sendMessage(tabId, youTubePage.WATCH)
//   chrome.scripting.executeScript({
//     target: {tabId: tabId},
//     files: ['youtubeHome.bundle.js']
//   })
// }, urlFilters.youtubeWatch)

// Event listener for: YouTube channel
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('YouTube Channel')
  const tabId = details.tabId
  chrome.tabs.sendMessage(tabId, youTubePage.CHANNEL)
}, urlFilters.youtubeChannel)

// Event listeners for loading new videos
// chrome.webRequest.onCompleted.addListener(details => {
//   console.log('YouTube Home: browse request')
//   console.log(details)
// }, {urls: [matchPatterns.youtubeBrowse]})

// chrome.webRequest.onCompleted.addListener(details => {
//   console.log('YouTube Watch: next request')
//   console.log(details)
// }, {urls: [matchPatterns.youtubeNext]})