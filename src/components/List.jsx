import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import HideListItem from './ListItem';

class HideList extends React.Component {
  createItem = (word) => {
    const { deleteWord, editWord } = this.props;
    return (
      <HideListItem
        word={word.word}
        deleteItem={deleteWord}
        editItem={editWord}
        id={word.id}
        key={word.id}
      />
    );
  }

  render() {
    const { words } = this.props;
    return (
      <Row className='hideList'>
        <Col span={24}>
          {words.map((word) => this.createItem(word))}
        </Col>
      </Row>
    );
  }
}

HideList.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteWord: PropTypes.func.isRequired,
  editWord: PropTypes.func.isRequired,
};

export default HideList;
