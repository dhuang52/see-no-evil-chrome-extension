import React from 'react'
import { Row, Col } from 'antd'
import Fuse from 'fuse.js'

const enterKeycode = 13

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.fuse = new Fuse(this.props.hideWords, {})
    this.state = {focus: false}
  }

  // constructor is called once on mount, maintain Fuse sarch bank after every update
  componentDidUpdate() {
    this.fuse.setCollection(this.props.hideWords)
  }

  onChange = (e) => {
    const value = e.target.value
    if (value) {
      const searchResults = this.fuse.search(value)
      this.props.handleSearch(searchResults, true)
    } else {
      this.props.handleSearch([], false)
    }
  }

  onKeyPress = (e) => {
    if (e.charCode === enterKeycode) {
      this.props.addHideWord(e.target.value)
    }
  }

  getClassName = () => {
    const focusClassName = this.state.focus ? 'focus' : ''
    return `searchBar ${focusClassName}`
  }

  render() {
    return (
    <Row>
      <Col
        span={24}
        className={this.getClassName()}
        onFocus={() => this.setState({focus: true})}
        onBlur={() => this.setState({focus: false})} >
        <input
          type='text'
          placeholder='Search or Add'
          onChange={this.onChange}
          onKeyPress={this.onKeyPress} />
      </Col>
    </Row>
    )
  }
}

export default Search