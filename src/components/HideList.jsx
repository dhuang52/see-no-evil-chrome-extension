import React from 'react'
import HideListItem from './HideListItem'
import { Row, Col } from 'antd'

class HideList extends React.Component {
  createItem = (word) => {
    return (
      <HideListItem
        word={word}
        deleteItem={() => this.props.deleteHideWord(word)}
        key={`hideListItem-${word}`} />
    )
  }

  render() {
    return (
      <Row className='hideList'>
        <Col span={20}>
          {this.props.hideWords.map(word => this.createItem(word))}
        </Col>
      </Row>
    )
  }
}

export default HideList