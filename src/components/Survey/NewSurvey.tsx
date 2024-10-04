import { Divider, Typography } from 'antd';
import React from 'react';
import FormNewSurvey from './FormNewSurvey';

const NewSurvey: React.FC = () => {
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
        Thông tin chung
      </Typography.Paragraph>
      <Divider style={{ margin: '10px 0' }} />
      <div style={{ padding: '8px 24px' }}>
        <FormNewSurvey />
      </div>
    </div>
  );
};

export default NewSurvey;
