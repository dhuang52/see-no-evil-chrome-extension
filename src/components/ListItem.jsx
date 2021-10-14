import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { animation: 'fadeIn' };
  }

  onChange = (e) => {
    const { editItem, id } = this.props;
    const newValue = e.target.value;
    editItem(id, newValue);
  }

  removeItem = () => {
    this.setState({ animation: 'fadeOut' });
  }

  getClassName = () => {
    const { animation } = this.state;
    return `input hideListItem ${animation}`;
  }

  handleAnimationEnd = () => {
    const { animation } = this.state;
    const { deleteItem, word } = this.props;
    if (animation === 'fadeOut') {
      this.setState({ animation: 'fadeOutEnd' }, () => deleteItem(word));
    }
  }

  render() {
    const { word } = this.props;
    return (
      <Row
        align='middle'
        onFocus={() => this.setState({ animation: 'focus' })}
        onBlur={() => this.setState({ animation: '' })}
        onAnimationEnd={this.handleAnimationEnd}
        className={this.getClassName()}
      >
        <Col span={22}>
          <input type='text' defaultValue={word} onChange={this.onChange} />
        </Col>
        <Col span={2} className='deleteIconContainer'>
          <DeleteOutlined
            className='deleteIcon'
            onClick={this.removeItem}
          />
        </Col>
      </Row>
    );
  }
}

ListItem.propTypes = {
  word: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
};

export default ListItem;
