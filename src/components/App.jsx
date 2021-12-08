import React from 'react';
import { Row, Col } from 'antd';
import Fuse from 'fuse.js';
import Header from './Header';
import Search from './Search';
import List from './List';
import Loading from './Loading';
import sortBy from '../constants/sortBy';
import defaultHideWords from '../constants/defaultHideWords';
import '../styles/App.css';
import 'antd/dist/antd.css';

const wordsStorageKey = 'hideWords';

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
      let words = defaultHideWords;
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words');
      } else if (result[wordsStorageKey]) {
        words = result[wordsStorageKey];
      }
      this.setState({ words, isLoading: false });
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
        this.setState({ words: newWords });
      }
    });
  }

  deleteWord = (word) => {
    let { words } = this.state;
    words = words.filter((w) => w.word !== word);
    this.syncStorageAndState(words);
  }

  addWord = (word) => {
    if (word) {
      const { words } = this.state;
      const i = words.findIndex((w) => w.word === word);
      // only add if word does not exist in list
      if (i < 0) {
        const dateNow = Date.now();
        const newWord = {
          word,
          lastModified: dateNow,
          id: dateNow,
        };
        words.push(newWord);
        this.syncStorageAndState(words);
        // Clear the search bar after adding a word
        this.setState({ search: '' });
      }
    }
  }

  editWord = (wordId, word) => {
    if (word) {
      const { words } = this.state;
      const i = words.findIndex((w) => w.id === wordId);
      if (i > -1) {
        words[i].word = word;
        words[i].lastModified = Date.now();
      }
      this.syncStorageAndState(words);
    }
  }

  sortWords = () => {
    let { words } = this.state;
    const { sortBySelected } = this.state;
    if (sortBySelected === sortBy.ABC) {
      words = words.slice().sort((a, b) => (a.word > b.word ? 1 : -1));
    } else if (sortBySelected === sortBy.NEW) {
      words = words.slice().sort((a, b) => (b.lastModified > a.lastModified ? 1 : -1));
    } else if (sortBySelected === sortBy.OLD) {
      words = words.slice().sort((a, b) => (a.lastModified > b.lastModified ? 1 : -1));
    }
    return words;
  }

  handleSortBy = (newSortBy) => {
    this.setState({ sortBySelected: newSortBy });
  }

  handleSearch = (search) => {
    this.setState({ search });
  }

  getSearchResults = () => {
    const { search } = this.state;
    const displayWords = this.sortWords();
    if (!search) {
      return displayWords;
    }
    this.fuse.setCollection(displayWords);
    const searchResults = this.fuse.search(search)
      .map((result) => displayWords[result.refIndex]);
    return searchResults;
  }

  renderApp = () => {
    const { sortBySelected, search } = this.state;
    return (
      <Row id='popup-app'>
        <Col span={24}>
          <Header
            sortBySelected={sortBySelected}
            handleSortBy={this.handleSortBy}
          />
          <div className='bodyContainer'>
            <Search
              addWord={this.addWord}
              handleSearch={this.handleSearch}
              search={search}
            />
            <List
              words={this.getSearchResults()}
              deleteWord={this.deleteWord}
              editWord={this.editWord}
            />
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const { isLoading } = this.state;
    return isLoading ? <Loading /> : this.renderApp();
  }
}

export default App;
