import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Space,
  Row,
  Col,
} from 'antd';
import sortBy from '../constants/sortBy';

class Header extends React.Component {
  handleSortBy = (newSortBy) => {
    const { handleSortBy } = this.props;
    handleSortBy(newSortBy);
  }

  getButtonType = (sortByType) => {
    const { sortBySelected } = this.props;
    return sortBySelected === sortByType ? 'primary' : 'default';
  }

  render() {
    return (
      <Row className='headerContainer' align='middle'>
        <Col flex='auto'>
          <h1>blur</h1>
        </Col>
        <Col flex='none' className='sortyByButtons'>
          <Space>
            <Button size='small' shape='round' type={this.getButtonType(sortBy.ABC)} onClick={() => this.handleSortBy(sortBy.ABC)}>
              {sortBy.ABC}
            </Button>
            <Button size='small' shape='round' type={this.getButtonType(sortBy.NEW)} onClick={() => this.handleSortBy(sortBy.NEW)}>
              {sortBy.NEW}
            </Button>
            <Button size='small' shape='round' type={this.getButtonType(sortBy.OLD)} onClick={() => this.handleSortBy(sortBy.OLD)}>
              {sortBy.OLD}
            </Button>
          </Space>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {
  handleSortBy: PropTypes.func.isRequired,
  sortBySelected: PropTypes.oneOf(['old', 'new', 'abc']).isRequired,
};

export default Header;
