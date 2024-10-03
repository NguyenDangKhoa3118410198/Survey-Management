import React from 'react';
import { Button, Table, Typography } from 'antd';
import { columns } from 'data/columnsUserList';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { userList } = useUser();

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
          <Button
            style={{
              backgroundColor: 'var(--main-color)',
              color: '#fff',
              borderRadius: '20px',
            }}
            onClick={handleCreateUser}
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
            rowKey='id'
            dataSource={userList ?? []}
            columns={columns}
            scroll={{ y: 'calc(100vh - 360px)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
