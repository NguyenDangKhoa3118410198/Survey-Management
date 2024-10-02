import useStore from 'hooks/useStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = useStore((state) => state.token);
  const isAuthenticated = !!token;

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
};

export default PrivateRoute;
