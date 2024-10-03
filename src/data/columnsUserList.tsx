import { EyeOutlined } from '@ant-design/icons';
import { Button, TableProps } from 'antd';
import { IUser } from 'hooks/useUser';

export const columns: TableProps<IUser>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    render: (text: string) => <span style={{ color: '#1890FF' }}> {text}</span>,
  },
  {
    title: 'Ảnh đại diện',
    dataIndex: 'avatar',
    align: 'center',
    render: (avatar: string) =>
      avatar ? (
        <img
          src={avatar}
          alt='avatar'
          style={{
            width: 50,
            height: 50,
          }}
        />
      ) : null,
  },
  {
    title: 'Họ và tên',
    dataIndex: 'fullName',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'birthDate',
    align: 'center',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: 'Xem chi tiết',
    dataIndex: 'detail',
    align: 'center',
    render: () => (
      <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
        <EyeOutlined style={{ color: '#284698', fontSize: '20px' }} />
      </Button>
    ),
  },
];
