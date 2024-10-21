import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, TableProps } from 'antd';
import { deleteSurveyById } from 'components/Survey/services/fecthAPI';
import { ISurvey } from 'hooks/useSurvey';
import { Link } from 'react-router-dom';

export const columns: TableProps<ISurvey>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    fixed: 'left',
    width: 80,
    render: (text: string) => <span style={{ color: '#1890FF' }}> {text}</span>,
  },
  {
    title: 'Tên khảo sát',
    dataIndex: 'surveyName',
    align: 'left',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Điểm thưởng',
    dataIndex: 'averageScore',
    align: 'center',
    width: 120,
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startDate',
    align: 'center',
    width: 150,
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endDate',
    align: 'center',
    width: 150,
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Tổng nội dung khảo sát',
    dataIndex: 'totalContent',
    align: 'center',
    width: 150,
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Xem chi tiết',
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (record: ISurvey) =>
      record && record.id ? (
        <Link to={`/surveys/${record.id}`}>
          <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
            <EyeOutlined style={{ color: '#284698', fontSize: '20px' }} />
          </Button>
        </Link>
      ) : null,
  },
  {
    title: 'Xóa',
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (record: ISurvey) => (
      <Popconfirm
        title='Bạn có chắc chắn muốn xóa khảo sát này?'
        onConfirm={() => {
          if (record.id) {
            deleteSurveyById(record.id);
            message.success(`Xóa thành công khảo sát ID: ${record.id}`);
          }
        }}
        okText='Có'
        cancelText='Không'
      >
        <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
          <DeleteOutlined style={{ color: '#284698', fontSize: '20px' }} />
        </Button>
      </Popconfirm>
    ),
  },
];
