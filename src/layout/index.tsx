import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import React from 'react';
import HeaderLayout from 'components/HeaderLayout';
import Sidebar from 'components/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderLayout />
      <Layout>
        <Sidebar />
        <Layout.Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
