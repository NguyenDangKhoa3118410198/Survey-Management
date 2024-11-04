import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Image, message, Popconfirm, TableProps, Tag } from 'antd';
import { deleteUserById } from 'components/User/services/fetchAPI';
import { IUser } from 'hooks/useUser';
import { Link } from 'react-router-dom';
import { getTagColor } from 'utils';

export const columns: TableProps<IUser>['columns'] = [
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>ID</span>,
    dataIndex: 'id',
    align: 'center',
    fixed: 'left',
    width: 80,
    render: (id: string) => (
      <Link to={`${id}`} style={{ color: '#1890FF' }}>
        {id}
      </Link>
    ),
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
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: 10,
          }}
        />
      ) : null,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Họ và tên</span>,
    dataIndex: 'fullName',
    width: 200,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Email</span>,
    dataIndex: 'email',
    width: 250,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Ngày sinh</span>,
    dataIndex: 'birthDate',
    align: 'center',
    width: 100,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Giới tính</span>,
    dataIndex: 'gender',
    width: 100,
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>Trạng thái</span>,
    dataIndex: 'status',
    width: 100,
    render: (status) => (
      <Tag color={getTagColor(status ? status : undefined)}>
        {status || 'Chưa chọn'}
      </Tag>
    ),
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
