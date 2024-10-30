import { Card, Dropdown, Flex, message, Popconfirm } from 'antd';
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
  const userStatus = useUser.getState().getStatusById(Number(userDetail?.id));

  useEffect(() => {
    if (!isLoading && userDetail === undefined) {
      navigate('/404');
    }
  }, [id, userDetail, isLoading, isError, navigate]);

  const handleResetPassword = () => {
    if (userDetail) {
      if (userStatus === 'Tạm ngưng') {
        resetPassword(Number(userDetail.id));
        message.success('Reset Password thành công');
      } else message.warning('Tài khoản đang hoạt động hoặc khóa');
    } else {
      console.error('User detail is not available.');
    }
  };

  const memoizedUserDetail = useMemo(() => userDetail, [userDetail]);
  const items = [
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
    <Card
      title={`Chi tiết người dùng #${userDetail?.id}`}
      extra={
        <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
          <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
        </Dropdown>
      }
    >
      <FormNewUser userDetail={memoizedUserDetail} />
    </Card>
  );
};

export default UserDetail;
