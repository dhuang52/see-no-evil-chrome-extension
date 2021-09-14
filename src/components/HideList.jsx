import React from 'react'
import HideListItem from './HideListItem'
import { Row, Col } from 'antd'

class HideList extends React.Component {
  createItem = (hideWord) => {
    return (
      <HideListItem
        word={hideWord.word}
        deleteItem={this.props.deleteHideWord}
        editItem={this.props.editHideWord}
        id={hideWord.id}
        key={hideWord.id} />
    )
  }

  render() {
    return (
      <Row className='hideList'>
        <Col span={24}>
          {this.props.hideWords.map(hideWord => this.createItem(hideWord))}
        </Col>
      </Row>
    )
  }
}

export default HideList