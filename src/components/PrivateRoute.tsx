import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from 'hooks/useStore';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = useStore((state) => state.token);

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default PrivateRoute;
