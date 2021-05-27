import React from 'react'
import Header from './Header'
import Search from './Search'
import HideList from './HideList'
import Loading from './Loading'
import { sortBy } from '../constants/sortBy'
import { Row, Col, Space } from 'antd'
import '../styles/App.css'
import 'antd/dist/antd.css'

const hideWordsStorageKey = 'hideWords'
const dateNow = Date.now()
const defaultHideWord = {
  word: 'add some words in the search bar',
  lastModified: dateNow,
  id: dateNow
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      hideWords: [],
      sortBy: sortBy.NEW,
      displayHideWords: [],
      isSearching: false,
    }
  }

  componentDidMount() {
    this.getHideWordsFromSyncStorage()
  }

  getHideWordsFromSyncStorage = () => {
    chrome.storage.sync.get(hideWordsStorageKey, (result) => {
      let hideWords = [defaultHideWord]
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words')
      } else if (result[hideWordsStorageKey]) {
        hideWords = result[hideWordsStorageKey]
      }
      // React does not properly rerender when calling setState in callback
      this.setState({
        hideWords,
        isLoading: false,
      })
    })
  }

  syncStorageAndState = (newHideWordsList) => {
    const storageKvp = {}
    storageKvp[hideWordsStorageKey] = newHideWordsList
    chrome.storage.sync.set(storageKvp, () => {
      if (chrome.runtime.lastError) {
        console.log('error while setting hide words')
      } else {
        console.log('successfully set hide words list', newHideWordsList)
        // this.setState({hideWords: newHideWordsList})
      }
    })
  }

  deleteHideWord = (removeWord) => {
    let { hideWords, displayHideWords } = this.state
    hideWords = hideWords.filter(hideWord => hideWord.word !== removeWord)
    displayHideWords = displayHideWords.filter(hideWord => hideWord.word !== removeWord)
    this.syncStorageAndState(hideWords)
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({hideWords, displayHideWords})
  }

  addHideWord = (addWord) => {
    if (!addWord) {
      return
    }
    const { hideWords, displayHideWords } = this.state
    // only add if word does not exist in list
    const i = hideWords.findIndex(hideWord => hideWord.word === addWord)
    if (i < 0) {
      const dateNow = Date.now()
      const newHideWord = {
        word: addWord,
        lastModified: dateNow,
        id: dateNow
      }
      const newHideWords = [newHideWord, ...hideWords]
      const newDisplayHideWords = [newHideWord, ...displayHideWords]
      this.syncStorageAndState(newHideWords)
      // should setState in syncStorageAndState but it messes up the fadeOut animation
      this.setState({
        hideWords: newHideWords,
        displayHideWords: newDisplayHideWords
      })
    }
  }

  editHideWord = (hideWordId, newWord) => {
    if (!newWord) {
      return
    }
    let { hideWords } = this.state
    hideWords = hideWords.map(hideWord => { 
      if (hideWord.id === hideWordId) {
        return {
          word: newWord,
          lastModified: Date.now(),
          id: hideWord.id
        }
      }
      return hideWord
    })
    this.syncStorageAndState(hideWords)
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({hideWords})
  }

  handleSortBy = (newSortBy) => {
    let { hideWords, displayHideWords } = this.state
    if (newSortBy === sortBy.ABC) {
      hideWords = hideWords.slice().sort((a, b) => a.word > b.word ? 1 : -1)
      displayHideWords = displayHideWords.slice().sort((a, b) => a.word > b.word ? 1 : -1)
    } else if (newSortBy === sortBy.NEW) {
      hideWords = hideWords.slice().sort((a, b) => b.lastModified > a.lastModified ? 1 : -1)
      displayHideWords = displayHideWords.slice().sort((a, b) => b.lastModified > a.lastModified ? 1 : -1)
    } else if (newSortBy === sortBy.OLD) {
      hideWords = hideWords.slice().sort((a, b) => a.lastModified > b.lastModified ? 1 : -1)
      displayHideWords = displayHideWords.slice().sort((a, b) => a.lastModified > b.lastModified ? 1 : -1)
    }
    this.setState({
      hideWords,
      displayHideWords,
      sortBy: newSortBy
    })
  }

  handleSearch = (searchResults, isSearching) => {
    const displayHideWords = searchResults.map(result => this.state.hideWords[result.refIndex])
    this.setState({
      displayHideWords,
      isSearching,
    })
  }

  renderApp = () => (
    <Row id='popup-app'>
      <Col span={24}>
        <Space direction='vertical' style={{width: '100%'}}>
          <Header
            sortBy={this.state.sortBy}
            handleSortBy={this.handleSortBy} />
          <Search
            hideWords={this.state.hideWords.map(hideWord => hideWord.word)}
            addHideWord={this.addHideWord}
            handleSearch={this.handleSearch} />
          <HideList
            hideWords={this.state.isSearching ? this.state.displayHideWords : this.state.hideWords}
            deleteHideWord={this.deleteHideWord}
            editHideWord={this.editHideWord} />
        </Space>
      </Col>
    </Row>
  )

  renderLoading = () => (<Loading />)

  render() {
    return this.state.isLoading ? this.renderLoading() : this.renderApp()
  }
}

export default App