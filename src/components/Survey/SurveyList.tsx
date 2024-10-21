import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { columns } from 'data/columnsSurveyList';
import { useNavigate } from 'react-router-dom';
import useSurvey from 'hooks/useSurvey';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useFilter from 'hooks/useFilter';
import dayjs from 'dayjs';

const SurveyList: React.FC = () => {
  const navigate = useNavigate();
  const { surveyList } = useSurvey();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const {
    filteredData,
    handleKeyValueFilterChange,
    handleAllFilterChange,
    searchParams,
    setSearchParams,
  } = useFilter({
    initialData: surveyList,
  });

  const handleCreateSurvey = () => {
    navigate('/surveys/create');
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
      }}
    >
      <Card
        title='Bộ lọc'
        style={{ marginBottom: 30 }}
        extra={
          <p
            onClick={toggleExpand}
            style={{ cursor: 'pointer', color: 'var(--main-color)' }}
          >
            {isExpanded ? 'Mở rộng' : 'Thu nhỏ'}
          </p>
        }
      >
        {isExpanded ? (
          <>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='text'
                    value={searchParams.get('id') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('id', e.target.value)
                    }
                    placeholder='ID'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='text'
                    value={searchParams.get('surveyName') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('surveyName', e.target.value)
                    }
                    placeholder='Tên khảo sát'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='number'
                    min={0}
                    value={searchParams.get('averageScore') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('averageScore', e.target.value)
                    }
                    placeholder='Điểm thưởng'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <DatePicker
                    className='filterSelect'
                    format='DD/MM/YYYY'
                    value={
                      searchParams.get('startDate')
                        ? dayjs(
                            Number(
                              decodeURIComponent(searchParams.get('startDate')!)
                            )
                          )
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
                    style={{ width: '100%', borderRadius: 6 }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <DatePicker
                    className='filterSelect'
                    format='DD/MM/YYYY'
                    value={
                      searchParams.get('endDate')
                        ? dayjs(
                            Number(
                              decodeURIComponent(searchParams.get('endDate')!)
                            )
                          )
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        handleKeyValueFilterChange(
                          'endDate',
                          encodeURIComponent(date.valueOf().toString())
                        );
                      } else {
                        handleKeyValueFilterChange('endDate', '');
                      }
                    }}
                    placeholder='Chọn ngày kết thúc'
                    style={{ width: '100%', borderRadius: 6 }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='number'
                    min={0}
                    value={searchParams.get('totalContent') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('totalContent', e.target.value)
                    }
                    placeholder='Tổng số khảo sát'
                    allowClear
                  />
                </Col>
              </Row>
              <Button
                type='default'
                onClick={clearFilters}
                style={{
                  width: 100,
                  display: 'flex',
                  marginLeft: 'auto',
                  backgroundColor: 'var(--main-color)',
                  color: '#fff',
                }}
              >
                Xóa bộ lọc
              </Button>
            </Space>
          </>
        ) : null}
      </Card>

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
