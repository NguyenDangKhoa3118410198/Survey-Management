import React from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import useStore from 'hooks/useStore';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderLayout: React.FC = () => {
  const { email, clearUser } = useStore();

  const handleLogout = () => {
    clearUser();
  };

  const menuItems = [
    {
      key: 'logout',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignContent: 'center',
            width: '100%',
          }}
        >
          <Link
            to='/'
            style={{ flex: 1, textAlign: 'left' }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Link>
          <LogoutOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
        </div>
      ),
    },
  ];

  return (
    <Header style={{ padding: 0, backgroundColor: '#284698' }}>
      <div style={{ height: '100%' }}>
        <Dropdown overlay={<Menu items={menuItems} />} placement='bottomRight'>
          <Button
            style={{
              display: 'flex',
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: 'white',
              alignItems: 'center',
              height: '100%',
              fontSize: '16px',
              fontWeight: 700,
              padding: '0 20px',
              borderRadius: '0',
            }}
          >
            <UserOutlined style={{ fontSize: '20px' }} />
            {email}
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderLayout;
