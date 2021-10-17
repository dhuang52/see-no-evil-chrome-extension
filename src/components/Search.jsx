import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

const ENTER_KEYCODE = 13;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { focus: false };
  }

  onChange = (e) => {
    const { handleSearch } = this.props;
    handleSearch(e.target.value);
  }

  onKeyPress = (e) => {
    if (e.charCode === ENTER_KEYCODE) {
      const { addWord } = this.props;
      addWord(e.target.value);
    }
  }

  getClassName = () => {
    const { focus } = this.state;
    const focusClassName = focus ? 'focus' : '';
    return `searchBar ${focusClassName}`;
  }

  render() {
    const { search } = this.props;
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
            value={search}
          />
        </Col>
      </Row>
    );
  }
}

Search.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  addWord: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default Search;
