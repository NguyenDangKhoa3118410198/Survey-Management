import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Menu,
  MenuProps,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormNewUser from './FormNewUser';
import { IUser } from 'hooks/useUser';
import { fetchUserbyId } from './services/fetchAPI';
import { useQuery } from '@tanstack/react-query';
import { EllipsisOutlined, RetweetOutlined } from '@ant-design/icons';

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);

  const {
    data: userDetail,
    isLoading,
    isError,
  } = useQuery<IUser | undefined>({
    queryKey: ['userDetail', id],
    queryFn: () => (id ? fetchUserbyId(id) : undefined),
    enabled: !!id,
  });

  useEffect(() => {
    if (!isLoading && userDetail === undefined) {
      navigate('/404');
    }
  }, [id, userDetail, isLoading, isError, navigate]);

  const memoizedUserDetail = useMemo(() => userDetail, [userDetail]);
  const menuItems: MenuProps['items'] = [
    {
      key: 'resetPassword',
      label: (
        <div
          onClick={() => {
            setIsResetPassword(true);
          }}
        >
          <Flex gap={10}>
            <RetweetOutlined />
            Reset Password
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: 'calc(100vh - 150px)',
        overflowY: 'auto',
      }}
    >
      <Flex justify='space-between' align='center'>
        <Typography.Paragraph
          style={{
            fontSize: '18px',
            fontWeight: '700',
            margin: '0',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Chi tiết người dùng
          {userDetail?.id && (
            <span style={{ marginLeft: '8px' }}>#{userDetail?.id}</span>
          )}
        </Typography.Paragraph>
        <Dropdown overlay={<Menu items={menuItems} />} placement='bottomRight'>
          <EllipsisOutlined
            style={{ transform: 'rotate(90deg)', marginRight: 16 }}
          />
        </Dropdown>
      </Flex>

      <Divider style={{ margin: '10px 0' }} />
      <div style={{ padding: '8px 24px' }}>
        <FormNewUser
          userDetail={memoizedUserDetail}
          isResetPassword={isResetPassword}
          setIsResetPassword={setIsResetPassword}
        />
      </div>
    </div>
  );
};

export default UserDetail;
