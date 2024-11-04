import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('users');
  const [collapsed, setCollapsed] = useState<boolean>(false);

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
          Quản lý người dùng
        </Link>
      ),
      icon: <UserOutlined />,
    },
    {
      key: 'survey',
      label: (
        <Link to='/surveys' style={{ fontWeight: '600' }}>
          Quản lý khảo sát
        </Link>
      ),
      icon: <FileTextOutlined />,
    },
  ];

  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsedState) => setCollapsed(collapsedState)}
      className='site-layout-background'
    >
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
