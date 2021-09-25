import React from 'react'
import { Button, Space, Row, Col } from 'antd'
import { sortBy } from '../constants/sortBy'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSortBy = (newSortBy) => {
    this.props.handleSortBy(newSortBy)
  }

  getButtonType = (sortByType) => {
    return this.props.sortBy === sortByType ? 'primary' : 'default'
  }

  render() {
    return (
      <Row className='headerContainer' align='middle'>
        <Col>
          <Space>
            <h1>blur</h1>
            <Button size='small' shape='round'
              type={this.getButtonType(sortBy.ABC)}
              onClick={() => this.handleSortBy(sortBy.ABC)}>
                {sortBy.ABC}
            </Button>
            <Button size='small' shape='round'
              type={this.getButtonType(sortBy.NEW)}
              onClick={() => this.handleSortBy(sortBy.NEW)}>
                {sortBy.NEW}
              </Button>
            <Button size='small' shape='round'
              type={this.getButtonType(sortBy.OLD)}
              onClick={() => this.handleSortBy(sortBy.OLD)}>
                {sortBy.OLD}
              </Button>
          </Space>
        </Col>
      </Row>
    )
  }
}

export default Header