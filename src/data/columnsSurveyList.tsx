import { EyeOutlined } from '@ant-design/icons';
import { Button, TableProps } from 'antd';

interface Survey {
  id: number;
  surveyName: string;
  averageScore: number;
  startDate: string;
  endDate: string;
  totalContent: number;
}

export const columns: TableProps<Survey>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (text: string) => <span style={{ color: '#1890FF' }}> {text}</span>,
  },
  {
    title: 'Tên khảo sát',
    dataIndex: 'surveyName',
    key: 'surveyName',
    align: 'left',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Điểm thưởng',
    dataIndex: 'averageScore',
    key: 'averageScore',
    align: 'center',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startDate',
    key: 'startDate',
    align: 'center',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endDate',
    key: 'endDate',
    align: 'center',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Tổng nội dung khảo sát',
    dataIndex: 'totalContent',
    key: 'totalContent',
    align: 'center',
    render: (text: string) => <span> {text}</span>,
  },
  {
    title: 'Xem chi tiết',
    key: 'action',
    align: 'center',
    render: () => (
      <Button style={{ border: 'none', backgroundColor: 'transparent' }}>
        <EyeOutlined style={{ color: '#284698', fontSize: '20px' }} />
      </Button>
    ),
  },
];
