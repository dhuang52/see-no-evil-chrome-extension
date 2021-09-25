import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

class HideListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      focus: false,
    };
  }

  onChange = (e) => {
    const { editItem, id } = this.props;
    const newValue = e.target.value;
    // const originalValue = this.props.word;
    editItem(id, newValue);
  }

  removeItem = () => {
    this.setState({ removed: true });
  }

  getClassName = () => {
    const { removed, focus } = this.state;
    const animationClassName = removed ? 'fadeOut' : 'fadeIn';
    const focusClassName = focus ? 'focus' : '';
    return `input hideListItem ${animationClassName} ${focusClassName}`;
  }

  handleAnimationEnd = () => {
    const { removed } = this.state;
    const { deleteItem, word } = this.props;
    if (removed) {
      deleteItem(word);
    }
  }

  render() {
    const { word } = this.props;
    return (
      <Row
        align='middle'
        onFocus={() => this.setState({ focus: true })}
        onBlur={() => this.setState({ focus: false })}
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

HideListItem.propTypes = {
  word: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
};

export default HideListItem;
