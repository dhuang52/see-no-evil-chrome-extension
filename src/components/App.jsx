import React from 'react';
import { Row, Col, Space } from 'antd';
import Header from './Header';
import Search from './Search';
import HideList from './HideList';
import Loading from './Loading';
import sortBy from '../constants/sortBy';
import '../styles/App.css';
import 'antd/dist/antd.css';

const hideWordsStorageKey = 'hideWords';
const defaultHideWord = {
  word: 'add some words in the search bar',
  lastModified: Date.now(),
  id: Date.now(),
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hideWords: [],
      sortBySelected: sortBy.NEW,
      displayHideWords: [],
      isSearching: false,
    };
  }

  componentDidMount() {
    this.getHideWordsFromSyncStorage();
  }

  getHideWordsFromSyncStorage = () => {
    chrome.storage.sync.get(hideWordsStorageKey, (result) => {
      let hideWords = [defaultHideWord];
      if (chrome.runtime.lastError) {
        // TODO: display error message to user
        console.log('error while getting hide words');
      } else if (result[hideWordsStorageKey]) {
        hideWords = result[hideWordsStorageKey];
      }
      // React does not properly rerender when calling setState in callback
      this.setState({
        hideWords,
        isLoading: false,
      });
    });
  }

  syncStorageAndState = (newHideWordsList) => {
    const storageKvp = {};
    storageKvp[hideWordsStorageKey] = newHideWordsList;
    chrome.storage.sync.set(storageKvp, () => {
      if (chrome.runtime.lastError) {
        console.log('error while setting hide words');
      } else {
        console.log('successfully set hide words list', newHideWordsList);
        // this.setState({hideWords: newHideWordsList})
      }
    });
  }

  deleteHideWord = (removeWord) => {
    let { hideWords, displayHideWords } = this.state;
    hideWords = hideWords.filter((hideWord) => hideWord.word !== removeWord);
    displayHideWords = displayHideWords.filter((hideWord) => hideWord.word !== removeWord);
    this.syncStorageAndState(hideWords);
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({ hideWords, displayHideWords });
  }

  addHideWord = (addWord) => {
    if (!addWord) {
      return;
    }
    const { hideWords, displayHideWords, sortBySelected } = this.state;
    // only add if word does not exist in list
    const i = hideWords.findIndex((hideWord) => hideWord.word === addWord);
    if (i < 0) {
      const dateNow = Date.now();
      const newHideWord = {
        word: addWord,
        lastModified: dateNow,
        id: dateNow,
      };
      const newHideWords = [newHideWord, ...hideWords];
      const newDisplayHideWords = [newHideWord, ...displayHideWords];
      this.syncStorageAndState(newHideWords);
      // should setState in syncStorageAndState but it messes up the fadeOut animation
      this.setState({
        hideWords: newHideWords,
        displayHideWords: newDisplayHideWords,
      }, () => this.handleSortBy(sortBySelected));
    }
  }

  editHideWord = (hideWordId, newWord) => {
    if (!newWord) {
      return;
    }
    let { hideWords } = this.state;
    hideWords = hideWords.map((hideWord) => {
      if (hideWord.id === hideWordId) {
        return {
          word: newWord,
          lastModified: Date.now(),
          id: hideWord.id,
        };
      }
      return hideWord;
    });
    this.syncStorageAndState(hideWords);
    // should setState in syncStorageAndState but it messes up the fadeOut animation
    this.setState({ hideWords });
  }

  handleSortBy = (newSortBy) => {
    let { hideWords, displayHideWords } = this.state;
    const sortyByAlpha = (a, b) => (a.word > b.word ? 1 : -1);
    const sortByNew = (a, b) => (b.lastModified > a.lastModified ? 1 : -1);
    const sortByOld = (a, b) => (a.lastModified > b.lastModified ? 1 : -1);
    if (newSortBy === sortBy.ABC) {
      hideWords = hideWords.slice().sort(sortyByAlpha);
      displayHideWords = displayHideWords.slice().sort(sortyByAlpha);
    } else if (newSortBy === sortBy.NEW) {
      hideWords = hideWords.slice().sort(sortByNew);
      displayHideWords = displayHideWords.slice().sort(sortByNew);
    } else if (newSortBy === sortBy.OLD) {
      hideWords = hideWords.slice().sort(sortByOld);
      displayHideWords = displayHideWords.slice().sort(sortByOld);
    }
    this.setState({
      hideWords,
      displayHideWords,
      sortBySelected: newSortBy,
    });
  }

  handleSearch = (searchResults, isSearching) => {
    const { hideWords } = this.state;
    const displayHideWords = searchResults.map((result) => hideWords[result.refIndex]);
    this.setState({
      displayHideWords,
      isSearching,
    });
  }

  renderApp = () => {
    const {
      sortBySelected,
      isSearching,
      hideWords,
      displayHideWords,
    } = this.state;
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
                hideWords={hideWords.map((hideWord) => hideWord.word)}
                addHideWord={this.addHideWord}
                handleSearch={this.handleSearch}
              />
              <HideList
                hideWords={isSearching ? displayHideWords : hideWords}
                deleteHideWord={this.deleteHideWord}
                editHideWord={this.editHideWord}
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
