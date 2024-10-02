import Breadcrumbs from 'components/common/Breadcrumbs';
import PrivateRoute from 'components/common/PrivateRoute';
import React from 'react';
import { Outlet } from 'react-router-dom';

const LayoutManagement: React.FC = () => {
  return (
    <PrivateRoute>
      <Breadcrumbs />
      <Outlet />
    </PrivateRoute>
  );
};

export default LayoutManagement;
