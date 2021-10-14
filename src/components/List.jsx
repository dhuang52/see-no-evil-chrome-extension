import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import ListItem from './ListItem';

class List extends React.Component {
  createItem = (word) => {
    const { deleteWord, editWord } = this.props;
    return (
      <ListItem
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

List.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteWord: PropTypes.func.isRequired,
  editWord: PropTypes.func.isRequired,
};

export default List;
