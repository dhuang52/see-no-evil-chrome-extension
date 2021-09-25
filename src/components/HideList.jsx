import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import HideListItem from './HideListItem';

class HideList extends React.Component {
  createItem = (hideWord) => {
    const { deleteHideWord, editHideWord } = this.props;
    return (
      <HideListItem
        word={hideWord.word}
        deleteItem={deleteHideWord}
        editItem={editHideWord}
        id={hideWord.id}
        key={hideWord.id}
      />
    );
  }

  render() {
    const { hideWords } = this.props;
    return (
      <Row className='hideList'>
        <Col span={24}>
          {hideWords.map((hideWord) => this.createItem(hideWord))}
        </Col>
      </Row>
    );
  }
}

HideList.propTypes = {
  hideWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  deleteHideWord: PropTypes.func.isRequired,
  editHideWord: PropTypes.func.isRequired,
};

export default HideList;
