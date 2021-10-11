import React from 'react';
import { Row, Col, Space } from 'antd';
import Fuse from 'fuse.js';
import Header from './Header';
import Search from './Search';
import HideList from './List';
import Loading from './Loading';
import sortBy from '../constants/sortBy';
import '../styles/App.css';
import 'antd/dist/antd.css';

const wordsStorageKey = 'hideWords';
const defaultWord = {
  word: 'add some words in the search bar',
  lastModified: Date.now(),
  id: Date.now(),
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fuse = new Fuse([], { keys: ['word'] });
    this.state = {
      // true if retrieving words from chrome storage
      isLoading: true,
      // list of objects that describe: a word, an id, when the word was last modified
      words: [],
      // how words should be sorted
      sortBySelected: sortBy.NEW,
      // the user's search
      search: '',
    };
  }

  componentDidMount() {
    this.getWordsFromSyncStorage();
  }

  getWordsFromSyncStorage = () => {
    chrome.storage.sync.get(wordsStorageKey, (result) => {
      let words = [defaultWord];
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words');
      } else if (result[wordsStorageKey]) {
        words = result[wordsStorageKey];
      }
      // React does not properly rerender when calling setState in callback
      this.setState({
        words,
        isLoading: false,
      });
    });
  }

  syncStorageAndState = (newWords) => {
    const storageKvp = {};
    storageKvp[wordsStorageKey] = newWords;
    chrome.storage.sync.set(storageKvp, () => {
      if (chrome.runtime.lastError) {
        console.log('error while updating storage');
      } else {
        console.log('successfully updated storage', newWords);
      }
    });
  }

  deleteWord = (removeWord) => {
    let { words } = this.state;
    words = words.filter((word) => word.word !== removeWord);
    this.syncStorageAndState(words);
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({ words });
  }

  addWord = (addWord) => {
    if (!addWord) {
      return;
    }
    const { words, sortBySelected } = this.state;
    // only add if word does not exist in list
    const i = words.findIndex((word) => word.word === addWord);
    if (i < 0) {
      const dateNow = Date.now();
      const newWord = {
        word: addWord,
        lastModified: dateNow,
        id: dateNow,
      };
      words.push(newWord);
      this.syncStorageAndState(words);
      // should setState in syncStorageAndState but it messes up the fadeOut animation
      this.setState({
        words,
      }, () => this.handleSortBy(sortBySelected));
    }
  }

  editWord = (wordId, newWord) => {
    if (!newWord) {
      return;
    }
    let { words } = this.state;
    words = words.map((word) => {
      if (word.id === wordId) {
        return {
          word: newWord,
          lastModified: Date.now(),
          id: word.id,
        };
      }
      return word;
    });
    this.syncStorageAndState(words);
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({ words });
  }

  handleSortBy = (newSortBy) => {
    let { words } = this.state;
    if (newSortBy === sortBy.ABC) {
      words = words.slice().sort((a, b) => (a.word > b.word ? 1 : -1));
    } else if (newSortBy === sortBy.NEW) {
      words = words.slice().sort((a, b) => (b.lastModified > a.lastModified ? 1 : -1));
    } else if (newSortBy === sortBy.OLD) {
      words = words.slice().sort((a, b) => (a.lastModified > b.lastModified ? 1 : -1));
    }
    this.setState({
      words,
      sortBySelected: newSortBy,
    });
  }

  handleSearch = (search) => {
    this.setState({ search });
  }

  getSearchResults = () => {
    const { words, search } = this.state;
    if (!search) {
      return words;
    }
    this.fuse.setCollection(words);
    const searchResults = this.fuse.search(search)
      .map((result) => words[result.refIndex]);
    return searchResults;
  }

  renderApp = () => {
    const { sortBySelected } = this.state;
    return (
      <Row id='popup-app'>
        <Col span={24}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Header
              sortBySelected={sortBySelected}
              handleSortBy={this.handleSortBy}
            />
            <div className='bodyContainer'>
              <Search
                addWord={this.addWord}
                handleSearch={this.handleSearch}
              />
              <HideList
                words={this.getSearchResults()}
                deleteWord={this.deleteWord}
                editWord={this.editWord}
              />
            </div>
          </Space>
        </Col>
      </Row>
    );
  }

  renderLoading = () => (<Loading />)

  render() {
    const { isLoading } = this.state;
    return isLoading ? this.renderLoading() : this.renderApp();
  }
}

export default App;
