import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import Fuse from 'fuse.js';

const enterKeycode = 13;

class Search extends React.Component {
  constructor(props) {
    super(props);
    const { hideWords } = this.props;
    this.fuse = new Fuse(hideWords, {});
    this.state = { focus: false };
  }

  // constructor is called once on mount, maintain Fuse sarch bank after every update
  componentDidUpdate() {
    const { hideWords } = this.props;
    this.fuse.setCollection(hideWords);
  }

  onChange = (e) => {
    const { value } = e.target;
    const { handleSearch } = this.props;
    if (value) {
      const searchResults = this.fuse.search(value);
      handleSearch(searchResults, true);
    } else {
      handleSearch([], false);
    }
  }

  onKeyPress = (e) => {
    const { addHideWord } = this.props;
    if (e.charCode === enterKeycode) {
      addHideWord(e.target.value);
    }
  }

  getClassName = () => {
    const { focus } = this.state;
    const focusClassName = focus ? 'focus' : '';
    return `searchBar ${focusClassName}`;
  }

  render() {
    return (
      <Row>
        <Col
          span={24}
          className={this.getClassName()}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
        >
          <input
            type='text'
            placeholder='search or add'
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
          />
        </Col>
      </Row>
    );
  }
}

Search.propTypes = {
  hideWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSearch: PropTypes.func.isRequired,
  addHideWord: PropTypes.func.isRequired,
};

export default Search;
