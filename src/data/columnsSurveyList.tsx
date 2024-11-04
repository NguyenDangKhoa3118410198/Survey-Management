import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, TableProps } from "antd";
import { deleteSurveyById } from "components/Survey/services/fecthAPI";
import { ISurvey } from "hooks/useSurvey";
import { Link } from "react-router-dom";
import { numeralNumber } from "utils";

export const columns: TableProps<ISurvey>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
    fixed: "left",
    width: 80,
    render: (id: string) => (
      <Link to={`${id}`} style={{ color: "#1890FF" }}>
        {id}
      </Link>
    ),
  },
  {
    title: "Tên khảo sát",
    dataIndex: "surveyName",
    align: "left",
    width: 250,
  },
  {
    title: "Điểm thưởng",
    dataIndex: "averageScore",
    align: "center",
    width: 180,
    render: (averageScore: number) => numeralNumber(averageScore),
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "startDate",
    align: "center",
    width: 180,
  },
  {
    title: "Ngày kết thúc",
    dataIndex: "endDate",
    align: "center",
    width: 180,
  },
  {
    title: "Tổng nội dung khảo sát",
    dataIndex: "totalContent",
    align: "center",
    width: 180,
  },
  {
    title: "Xem chi tiết",
    align: "center",
    fixed: "right",
    width: 200,
    render: (record: ISurvey) =>
      record && record.id ? (
        <Link to={`/surveys/${record.id}`}>
          <Button style={{ border: "none", backgroundColor: "transparent" }}>
            <EyeOutlined style={{ color: "#284698", fontSize: "20px" }} />
          </Button>
        </Link>
      ) : null,
  },
  {
    title: "Xóa",
    align: "center",
    fixed: "right",
    width: 100,
    render: (record: ISurvey) => (
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa khảo sát này?"
        onConfirm={() => {
          if (record.id) {
            deleteSurveyById(record.id);
            message.success(`Xóa thành công khảo sát ID: ${record.id}`);
          }
        }}
        okText="Có"
        cancelText="Không"
      >
        <Button style={{ border: "none", backgroundColor: "transparent" }}>
          <DeleteOutlined style={{ color: "#284698", fontSize: "20px" }} />
        </Button>
      </Popconfirm>
    ),
  },
];
