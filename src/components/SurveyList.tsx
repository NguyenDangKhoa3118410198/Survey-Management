import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import { Button, Table, Typography } from 'antd';
import { mockSurveyListData } from 'data/mockData';
import { columns } from 'data/columnsSurveyList';

const SurveyList: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
      }}
    >
      <Breadcrumbs />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '4px 12px',
            height: '100%',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '10px 0',
            }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              Danh sách khảo sát
            </Typography.Title>
            <Button
              style={{
                backgroundColor: 'var(--main-color)',
                color: '#fff',
                borderRadius: '20px',
              }}
            >
              Tạo mới
            </Button>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              margin: '18px 26px 18px 18px',
            }}
          >
            <Table
              dataSource={mockSurveyListData}
              columns={columns}
              scroll={{ y: 'calc(100vh - 360px)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
