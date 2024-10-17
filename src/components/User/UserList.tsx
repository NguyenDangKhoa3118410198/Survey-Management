import React from 'react';
import { Button, Card, Input, Select, Space, Table, Typography } from 'antd';
import { columns } from 'data/columnsUserList';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useFilter from 'hooks/useFilter';

const { Option } = Select;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { userList } = useUser();
  const {
    filteredData,
    handleKeyValueFilterChange,
    handleAllFilterChange,
    searchParams,
  } = useFilter({
    initialData: userList,
  });

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 150px)',
      }}
    >
      <Card title='Bộ lọc' style={{ marginBottom: 24 }}>
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Space>
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
              value={searchParams.get('fullName') || ''}
              onChange={(e) =>
                handleKeyValueFilterChange('fullName', e.target.value)
              }
              placeholder='Name'
              allowClear
            />
            <Input
              style={{ width: 200 }}
              type='email'
              value={searchParams.get('email') || ''}
              onChange={(e) =>
                handleKeyValueFilterChange('email', e.target.value)
              }
              placeholder='Email'
              allowClear
            />
            <Select
              style={{ width: 200, borderRadius: '0px !important' }}
              className='filterSelect'
              value={searchParams.get('gender') || ''}
              onChange={(value: any) =>
                handleKeyValueFilterChange('gender', value)
              }
            >
              <Option value=''>Select Gender</Option>
              <Option value='Nam'>Nam</Option>
              <Option value='Nữ'>Nữ</Option>
              <Option value='Khác'>Khác</Option>
            </Select>
          </Space>
        </Space>
      </Card>
      <div
        style={{
          backgroundColor: '#fff',
          padding: '4px 12px',
          height: '100%',
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
            Danh sách người dùng
          </Typography.Title>
          <Space>
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
              onClick={handleCreateUser}
              icon={<PlusOutlined />}
            >
              Tạo mới
            </Button>
          </Space>
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
            scroll={{ y: 'calc(100vh - 360px)', x: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
