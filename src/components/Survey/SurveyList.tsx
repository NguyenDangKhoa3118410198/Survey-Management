import React, { useState, useEffect } from 'react';
import { Button, Card, DatePicker, Flex, Input, Space, Table, Typography } from 'antd';
import { columns } from 'data/columnsSurveyList';
import { useNavigate } from 'react-router-dom';
import useSurvey from 'hooks/useSurvey';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useFilter from 'hooks/useFilter';
import dayjs from 'dayjs';

const SurveyList: React.FC = () => {
  const navigate = useNavigate();
  const { surveyList } = useSurvey();
  const { filteredData, handleKeyValueFilterChange, handleAllFilterChange, searchParams } =
    useFilter({
      initialData: surveyList,
    });

  const handleCreateSurvey = () => {
    navigate('/surveys/create');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
      }}
    >
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

            <div>
              <Input
                prefix={<SearchOutlined />}
                placeholder='Nhập từ khóa tìm kiếm'
                allowClear
                onChange={(e) => handleAllFilterChange(e.target.value)}
                style={{
                  width: 200,
                  marginRight: '12px',
                  borderRadius: '14px',
                }}
              />

              <Button
                style={{
                  backgroundColor: 'var(--main-color)',
                  color: '#fff',
                  borderRadius: '20px',
                }}
                onClick={handleCreateSurvey}
                icon={<PlusOutlined />}
              >
                Tạo mới
              </Button>
            </div>
          </div>
          <Card title='Bộ lọc' style={{ marginBottom: 24 }}>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Flex wrap gap={10}>
                <Input
                  style={{ width: 200 }}
                  type='text'
                  value={searchParams.get('id') || ''}
                  onChange={(e) => handleKeyValueFilterChange('id', e.target.value)}
                  placeholder='ID'
                  allowClear
                />
                <Input
                  style={{ width: 200 }}
                  type='text'
                  value={searchParams.get('surveyName') || ''}
                  onChange={(e) => handleKeyValueFilterChange('surveyName', e.target.value)}
                  placeholder='Tên khảo sát'
                  allowClear
                />
                <Input
                  style={{ width: 200 }}
                  type='text'
                  value={searchParams.get('averageScore') || ''}
                  onChange={(e) => handleKeyValueFilterChange('averageScore', e.target.value)}
                  placeholder='Điểm thưởng'
                  allowClear
                />
                <DatePicker
                  format='DD/MM/YYYY'
                  value={
                    searchParams.get('startDate')
                      ? dayjs(Number(decodeURIComponent(searchParams.get('startDate')!)))
                      : null
                  }
                  onChange={(date) => {
                    if (date) {
                      handleKeyValueFilterChange(
                        'startDate',
                        encodeURIComponent(date.valueOf().toString())
                      );
                    } else {
                      handleKeyValueFilterChange('startDate', '');
                    }
                  }}
                  placeholder='Chọn ngày bắt đầu'
                  style={{ width: 200 }}
                />
              </Flex>
            </Space>
          </Card>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              margin: '18px 26px 18px 18px',
            }}
          >
            <Table
              rowKey='id'
              dataSource={filteredData ?? []}
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
