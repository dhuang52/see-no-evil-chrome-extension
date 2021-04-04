import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Loading from './components/Loading'

const bodyId = "see-no-evil-popup"
const popup = document.getElementById(bodyId)

ReactDOM.render(<Loading />, popup)

const hideWordsStorageKey = 'hideWords'
const defaultHideWord = {
  word: 'add some words in the search bar',
  date: new Date(),
}

chrome.storage.sync.get(hideWordsStorageKey, (result) => {
  let hideWords = [defaultHideWord]
  if (chrome.runtime.lastError) {
    console.log('error while getting hide words')
  } else if (result[hideWordsStorageKey]) {
    hideWords = result[hideWordsStorageKey]
  }
  console.log('retrieved', hideWords)
  ReactDOM.render(<App hideWords={hideWords} loading={false}/>, popup)
})