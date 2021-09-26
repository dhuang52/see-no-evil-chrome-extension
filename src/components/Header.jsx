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
            {Object.values(sortBy).map((sortByType) => (
              <Button key={sortByType} size='small' shape='round' type={this.getButtonType(sortByType)} onClick={() => this.handleSortBy(sortByType)}>
                {sortByType}
              </Button>
            ))}
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
