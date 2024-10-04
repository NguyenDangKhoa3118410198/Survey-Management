import { Divider, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import FormNewUser from './FormNewUser';
import { IUser } from 'hooks/useUser';
import { fetchUserbyId } from './services/fetchAPI';
import { useQuery } from '@tanstack/react-query';

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const { data: userDetail } = useQuery<IUser | undefined>({
    queryKey: ['userDetail', id],
    queryFn: () => {
      if (id) {
        return fetchUserbyId(id);
      }
      return undefined;
    },
    enabled: !!id,
  });

  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: 'calc(100vh - 150px)',
        overflowY: 'auto',
      }}
    >
      <Typography.Paragraph
        style={{
          fontSize: '18px',
          fontWeight: '700',
          margin: '0',
          padding: '8px 24px',
        }}
      >
        Chi tiết người dùng
      </Typography.Paragraph>
      <Divider style={{ margin: '10px 0' }} />
      <div style={{ padding: '8px 24px' }}>
        <FormNewUser userDetail={userDetail} />
      </div>
    </div>
  );
};

export default UserDetail;
