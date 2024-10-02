import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('users');

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('survey')) {
      setSelectedKey('survey');
    } else {
      setSelectedKey('users');
    }
  }, []);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  const items: MenuProps['items'] = [
    {
      key: 'users',
      label: (
        <Link to='/users' style={{ fontWeight: '600' }}>
          <UserOutlined style={{ marginRight: '4px', fontSize: '15px' }} />
          Quản lý người dùng
        </Link>
      ),
    },
    {
      key: 'survey',
      label: (
        <Link to='/surveys' style={{ fontWeight: '600' }}>
          <FileTextOutlined style={{ marginRight: '4px', fontSize: '15px' }} />
          Quản lý khảo sát
        </Link>
      ),
    },
  ];

  return (
    <Sider width={230} className='site-layout-background'>
      <Menu
        mode='inline'
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={items}
        style={{ height: '100%', borderRight: 0, paddingTop: '8px' }}
      />
    </Sider>
  );
};

export default Sidebar;
