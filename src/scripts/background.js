import { matchPatterns } from '../constants/filter';

// Static injection for all relevant YouTube pages
chrome.webRequest.onCompleted.addListener((details) => {
  console.log('on a youtube page');
  const { tabId } = details;
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['youtube.bundle.js'],
  });
}, {
  urls: [matchPatterns.youtube,
    matchPatterns.youtubeSearch,
    matchPatterns.youtubeWatch,
    matchPatterns.youTubeChannel],
});
