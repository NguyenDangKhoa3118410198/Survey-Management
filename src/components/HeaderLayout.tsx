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
            fontWeight: '600',
          }}
        >
          <Link
            to='/'
            style={{ flex: 1, textAlign: 'left', fontSize: '14px' }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Link>
          <LogoutOutlined
            style={{ marginLeft: '8px', color: '#1890ff', fontSize: '16px' }}
          />
        </div>
      ),
    },
  ];

  return (
    <Header style={{ padding: 0, backgroundColor: '#284698' }}>
      <div style={{ height: '100%' }}>
        <Dropdown overlay={<Menu items={menuItems} />} placement='bottomRight'>
          <button
            style={{
              display: 'flex',
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: 'white',
              alignItems: 'center',
              height: '100%',
              fontSize: '15px',
              fontWeight: 600,
              padding: '0 20px',
              borderRadius: '0',
              cursor: 'pointer',
            }}
          >
            <UserOutlined style={{ fontSize: '20px', marginRight: '4px' }} />
            {email}
          </button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderLayout;
