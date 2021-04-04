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
      <Row>
        <Col>
        {/* HEADER */}
          <Row>
            <Col>
              <h2>See No Evil</h2>
            </Col>
          </Row>
        {/* SORT BY */}
          <Row>
            <Col>
              <Space>
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
        </Col>
      </Row>
    )
  }
}

export default Header