import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbNameMap: { [key: string]: string } = {
    '/users': 'Danh sách người dùng',
    '/surveys': 'Danh sách khảo sát',
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const breadcrumbName = breadcrumbNameMap[url] || snippet;

    return {
      key: url,
      title: <Link to={url}>{breadcrumbName}</Link>,
    };
  });

  return (
    <Breadcrumb
      style={{
        margin: '16px 0',
        backgroundColor: '#fff',
        padding: '4px 12px',
      }}
      items={breadcrumbItems}
    />
  );
};

export default Breadcrumbs;
