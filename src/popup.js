import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const bodyId = "see-no-evil-popup"
const popup = document.getElementById(bodyId)

// chrome.storage.sync.remove(hideWordsStorageKey, () => {
//   if (chrome.runtime.lastError) {
//     console.log('error while clearing hide words')
//   } else {
//     console.log('successfully cleared hide words list')
//   }
// })

ReactDOM.render(<App />, popup)