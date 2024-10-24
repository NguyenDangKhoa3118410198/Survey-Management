import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Image, message, Popconfirm, TableProps } from 'antd';
import { deleteUserById } from 'components/User/services/fetchAPI';
import { IUser } from 'hooks/useUser';
import { Link } from 'react-router-dom';

export const columns: TableProps<IUser>['columns'] = [
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>ID</span>,
    dataIndex: 'id',
    align: 'center',
    fixed: 'left',
    width: 80,
    render: (text: string) => <span style={{ color: '#1890FF' }}>{text}</span>,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Ảnh đại diện</span>,
    dataIndex: 'avatar',
    align: 'center',
    width: 140,
    render: (avatar: string) =>
      avatar ? (
        <Image
          src={avatar}
          alt='avatar'
          style={{
            width: 50,
            height: 50,
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      ) : null,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Họ và tên</span>,
    dataIndex: 'fullName',
    render: (text: string) => <span>{text}</span>,
    width: 200,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Email</span>,
    dataIndex: 'email',
    width: 250,
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Ngày sinh</span>,
    dataIndex: 'birthDate',
    align: 'center',
    width: 100,
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Giới tính</span>,
    dataIndex: 'gender',
    width: 100,
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Xem chi tiết</span>,
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (record: IUser) =>
      record && record.id ? (
        <Link to={`/users/${record.id}`}>
          <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
            <EyeOutlined style={{ color: '#284698', fontSize: '20px' }} />
          </Button>
        </Link>
      ) : null,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Xóa</span>,
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (record: IUser) =>
      record && record.id ? (
        <Popconfirm
          title='Bạn có chắc chắn muốn xóa người dùng này?'
          description='Hành động này không thể hoàn tác.'
          okText='Có'
          cancelText='Không'
          onConfirm={() => {
            deleteUserById(record.id);
            message.success(`Xóa thành công người dùng ID: ${record.id}`);
          }}
        >
          <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
            <DeleteOutlined style={{ color: '#284698', fontSize: '20px' }} />
          </Button>
        </Popconfirm>
      ) : null,
  },
];
