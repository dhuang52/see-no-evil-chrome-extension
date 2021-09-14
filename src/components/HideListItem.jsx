import React from 'react'
import { Row, Col } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

class HideListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      removed: false,
      focus: false
    }
  }

  onChange = (e) => {
    const newValue = e.target.value
    const originalValue = this.props.word
    this.props.editItem(this.props.id, newValue)
  }

  removeItem = () => {
    this.setState({removed: true})
  }

  getClassName = () => {
    const animationClassName = this.state.removed ? 'fadeOut' : 'fadeIn'
    const focusClassName = this.state.focus ? 'focus' : ''
    return `input hideListItem ${animationClassName} ${focusClassName}`
  }

  handleAnimationEnd = () => {
    if (this.state.removed) {
      this.props.deleteItem(this.props.word)
    }
  }

  render() {
    const { word } = this.props
    return (
      <Row
        onFocus={() => this.setState({focus: true})}
        onBlur={() => this.setState({focus: false})}
        onAnimationEnd={this.handleAnimationEnd}
        className={this.getClassName()}>
        <Col flex='auto'>
          <input type='text' defaultValue={word} onChange={this.onChange} />
        </Col>
        <Col flex='10px'>
          <DeleteOutlined
            className='deleteIcon'
            onClick={this.removeItem} />
        </Col>
      </Row>
    )
  }
}

export default HideListItem