import React from 'react';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/App.css';

// eslint-disable-next-line react/prefer-stateless-function
class Loading extends React.Component {
  render() {
    const antIcon = <LoadingOutlined spin />;
    return (
      <Row id='popup-loading' align='middle' justify='center'>
        <Col>
          <Spin indicator={antIcon} size='large' tip='Loading...' />
        </Col>
      </Row>
    );
  }
}

export default Loading;
