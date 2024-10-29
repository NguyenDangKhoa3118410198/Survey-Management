import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbMap {
  [key: string]: string;
}

const breadcrumbNameMap: BreadcrumbMap = {
  '/users': 'Danh sách người dùng',
  '/users/create': 'Tạo người dùng',
  '/surveys': 'Danh sách khảo sát',
  '/surveys/create': 'Tạo khảo sát',
  '/profile': 'Thông tin người dùng',
};

const usePathSnippets = () => {
  const location = useLocation();
  return location.pathname.split('/').filter((i) => i);
};

const getBreadcrumbName = (url: string, snippet: string) => {
  if (url.startsWith('/users') && /^\d+$/.test(snippet)) {
    return 'Chi tiết người dùng';
  }
  if (url.startsWith('/surveys') && /^\d+$/.test(snippet)) {
    return 'Chi tiết khảo sát';
  }
  return breadcrumbNameMap[url] || snippet;
};

const useBreadcrumbItems = (pathSnippets: string[], locationPath: string) => {
  return pathSnippets.map((snippet: string, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const breadcrumbName = getBreadcrumbName(url, snippet);
    const isActive = url === locationPath;

    return {
      key: url,
      title: isActive ? (
        <span className='breadcrumb-active'>{breadcrumbName}</span>
      ) : (
        <Link to={url}>
          <span className='breadcrumb'>{breadcrumbName}</span>
        </Link>
      ),
    };
  });
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSnippets = usePathSnippets();
  const breadcrumbItems = useBreadcrumbItems(pathSnippets, location.pathname);

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
