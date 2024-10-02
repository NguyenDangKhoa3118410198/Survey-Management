import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';
import HeaderLayout from 'components/common/HeaderLayout';
import Sidebar from 'components/common/Sidebar';

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
