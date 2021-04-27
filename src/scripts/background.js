import "regenerator-runtime/runtime.js";
import { urlFilters, matchPatterns } from '../constants/filter'
import hideListManager from './utils/HideListManager'

// YouTube home page
chrome.webRequest.onCompleted.addListener(details => {
  console.log('youtube home request complete')
  console.log(details)

}, {urls: [matchPatterns.youtube]});

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
    console.log('YouTube home', details)
    const tabId = details.tabId
    chrome.scripting.executeScript({
      target: {tabId},
      files: ['youtubeHome.bundle.js']
    })
  }
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

// YouTube browse request
chrome.webRequest.onCompleted.addListener(details => {
  console.log('youtube browse request complete')
  console.log(details)
}, {urls: [matchPatterns.youtubeBrowse]});