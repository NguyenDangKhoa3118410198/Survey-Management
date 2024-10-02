import Breadcrumbs from 'components/Breadcrumbs';
import PrivateRoute from 'components/PrivateRoute';
import React from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutManagementProps {
  children?: React.ReactNode;
}

const LayoutManagement: React.FC = () => {
  return (
    <PrivateRoute>
      <Breadcrumbs />
      <Outlet />
    </PrivateRoute>
  );
};

export default LayoutManagement;
