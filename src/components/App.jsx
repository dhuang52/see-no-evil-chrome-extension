import React from 'react'
import Header from './Header'
import Search from './Search'
import HideList from './HideList'
import { sortBy } from '../constants/sortBy'
import { Row, Col, Space } from 'antd'
import '../styles/App.css'
import 'antd/dist/antd.css'

const hideWordsStorageKey = 'hideWords'
const defaultHideWord = {
  word: 'add some words in the search bar',
  date: new Date(),
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // bad practice
      hideWords: this.props.hideWords ? [...this.props.hideWords] : [],
      sortBy: sortBy.NEW,
      displayHideWords: []
    }
    console.log(this.props)
    // this.clearStorage()
    // this.getHideWordsFromSyncStorage()
  }

  // DO NOT USE
  getHideWordsFromSyncStorage = () => {
    chrome.storage.sync.get(hideWordsStorageKey, (result) => {
      let hideWords = [defaultHideWord]
      if (chrome.runtime.lastError) {
        console.log('error while getting hide words')
      } else if (result[hideWordsStorageKey]) {
        hideWords = result[hideWordsStorageKey]
      }
      // React does not properly rerender when calling setState in callback
      console.log('retrieved')
      this.setState({ hideWords })
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

  clearStorage = () => {
    chrome.storage.sync.remove(hideWordsStorageKey, () => {
      if (chrome.runtime.lastError) {
        console.log('error while setting hide words')
      } else {
        console.log('successfully cleared hide words list')
      }
    })
  }

  deleteHideWord = (removeWord) => {
    let newHideWords = [...this.state.hideWords]
    newHideWords = newHideWords.filter(hideWord => hideWord.word !== removeWord)
    this.syncStorageAndState(newHideWords)
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({hideWords: newHideWords})
  }

  addHideWord = (addWord) => {
    if (!addWord) {
      return
    }
    const oldHideWords = [...this.state.hideWords]
    // only add if word does not exist in list
    const i = oldHideWords.findIndex(hideWord => hideWord.word === addWord)
    if (i < 0) {
      const newHideWord = {
        word: addWord,
        date: new Date(),
      }
      const newHideWordsList = [newHideWord, ...oldHideWords]
      this.syncStorageAndState(newHideWordsList)
      // should setState in syncStorageAndState but it messes up the fadeOut animation
      this.setState({hideWords: newHideWordsList})
    }
  }

  handleSortBy = (newSortBy) => {
    let newHideWords = [...this.state.hideWords]
    if (newSortBy === sortBy.ABC) {
      newHideWords = newHideWords.slice().sort((a, b) => a.word > b.word ? 1 : -1)
    } else if (newSortBy === sortBy.NEW) {
      newHideWords = newHideWords.slice().sort((a, b) => b.date > a.date ? 1 : -1)
    } else if (newSortBy === sortBy.OLD) {
      newHideWords = newHideWords.slice().sort((a, b) => a.date > b.date ? 1 : -1)
    }
    this.setState({
      hideWords: newHideWords,
      sortBy: newSortBy
    })
  }

  handleSearch = (displayHideWords) => {
    this.setState({displayHideWords})
  }

  render() {
    const allHideWords = this.state.hideWords.map(hideWord => hideWord.word)
    console.log(allHideWords)
    return (
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
              hideWords={this.state.displayHideWords.length ? this.state.displayHideWords : this.state.hideWords.map(hideWord => hideWord.word)}
              deleteHideWord={this.deleteHideWord} />
          </Space>
        </Col>
      </Row>
    )
  }
}

export default App