import { DeleteOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import React from 'react';

interface ICImageProps {
  userDetail: any;
  handleResetImage: () => void;
}

const CImage: React.FC<ICImageProps> = ({ userDetail, handleResetImage }) => {
  return (
    <>
      <div
        style={{
          width: '102px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '8px',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Image
          src={userDetail?.avatar}
          style={{
            width: '84px',
            height: '84px',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>
      <Button
        type='text'
        icon={
          <DeleteOutlined
            style={{
              color: 'red',
              fontSize: 20,
            }}
          />
        }
        onClick={handleResetImage}
        style={{
          marginTop: '4px',
          display: 'flex',
          width: '102px',
        }}
      >
        Xóa ảnh
      </Button>
    </>
  );
};

export default CImage;
