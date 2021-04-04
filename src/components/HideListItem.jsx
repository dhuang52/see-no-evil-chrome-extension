import React from 'react'
import { Row, Col } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

class HideListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {removed: false}
  }

  removeItem = () => {
    this.setState({removed: true})
  }

  getClassName = () => {
    return this.state.removed ? 'hideListItem fadeOut' : 'hideListItem fadeIn'
  }

  handleAnimationEnd = () => {
    if (this.state.removed) {
      this.props.deleteItem()
    }
  }

  render() {
    const { word } = this.props
    return (
      <Row
        align='middle'
        onAnimationEnd={this.handleAnimationEnd}
        className={this.getClassName()}>
        <Col span={20}>
          <input type='text' defaultValue={word} />
        </Col>
        <Col span={4} push={1}>
          <DeleteOutlined
            className='deleteIcon'
            onClick={this.removeItem} />
        </Col>
      </Row>
    )
  }
}

export default HideListItem