import { Divider, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import FormNewUser from './FormNewUser';

const UserDetail: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: 'calc(100vh - 150px)',
        overflowY: 'auto',
      }}
    >
      <Typography.Paragraph
        style={{
          fontSize: '18px',
          fontWeight: '700',
          margin: '0',
          padding: '8px 24px',
        }}
      >
        Chi tiết người dùng
      </Typography.Paragraph>
      <Divider style={{ margin: '10px 0' }} />
      <div style={{ padding: '8px 24px' }}>
        <FormNewUser />
      </div>
    </div>
  );
};

export default UserDetail;
