import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
  // From testing the following conditions seem to indicate that the popup was opened on a
  // secondary monitor
  window.screenLeft < 0
  || window.screenTop < 0
  || window.screenLeft > window.screen.width
  || window.screenTop > window.screen.height
) {
  chrome.runtime.getPlatformInfo((info) => {
    if (info.os === 'mac') {
      const fontFaceSheet = new CSSStyleSheet();
      fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `);
      fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `);
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        fontFaceSheet,
      ];
    }
  });
}

const bodyId = 'see-no-evil-popup';
const popup = document.getElementById(bodyId);

// chrome.storage.sync.remove(hideWordsStorageKey, () => {
//   if (chrome.runtime.lastError) {
//     console.log('error while clearing hide words')
//   } else {
//     console.log('successfully cleared hide words list')
//   }
// })

ReactDOM.render(<App />, popup);
