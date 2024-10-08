import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbMap {
  [key: string]: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbNameMap: BreadcrumbMap = {
    '/users': 'Danh sách người dùng',
    '/users/create': 'Tạo người dùng',
    '/surveys': 'Danh sách khảo sát',
    '/surveys/create': 'Tạo khảo sát',
    '/profile': 'Thông tin người dùng',
  };

  const pathSnippets: string[] = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((snippet: string, index: number) => {
    let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let breadcrumbName = breadcrumbNameMap[url] || snippet;

    if (url.startsWith('/users') && /^\d+$/.test(snippet)) {
      url = `/users/${snippet}`;
      breadcrumbName = 'Chi tiết người dùng';
    }

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
