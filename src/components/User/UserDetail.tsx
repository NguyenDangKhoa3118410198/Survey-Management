import {
  Divider,
  Dropdown,
  Flex,
  Menu,
  MenuProps,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormNewUser from './FormNewUser';
import useUser, { IUser } from 'hooks/useUser';
import { fetchUserbyId } from './services/fetchAPI';
import { useQuery } from '@tanstack/react-query';
import { EllipsisOutlined, RetweetOutlined } from '@ant-design/icons';

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useUser();

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

  const handleResetPassword = () => {
    if (userDetail) {
      resetPassword(Number(userDetail.id));
      message.success('Reset Password thành công');
    } else {
      console.error('User detail is not available.');
    }
  };

  const memoizedUserDetail = useMemo(() => userDetail, [userDetail]);
  const menuItems: MenuProps['items'] = [
    {
      key: 'resetPassword',
      label: (
        <Popconfirm
          title='Bạn có chắc chắn muốn reset mật khẩu không?'
          onConfirm={handleResetPassword}
          okText='Có'
          cancelText='Không'
        >
          <div>
            <Flex gap={10}>
              <RetweetOutlined />
              Reset Password
            </Flex>
          </div>
        </Popconfirm>
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
        <FormNewUser userDetail={memoizedUserDetail} />
      </div>
    </div>
  );
};

export default UserDetail;
