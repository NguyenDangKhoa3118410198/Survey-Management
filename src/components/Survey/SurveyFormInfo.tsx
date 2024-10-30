import { RedoOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  PopconfirmProps,
  Space,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import QuestionFormItem from './QuestionFormItem';

interface ISurveyFormInfoProps {
  form?: any;
  surveyDetail?: any;
}

const SurveyFormInfo: React.FC<ISurveyFormInfoProps> = ({
  form,
  surveyDetail,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (surveyDetail) {
      const {
        startDate,
        endDate,
        questions,
        originalStartDate,
        originalEndDate,
        ...restUserDetail
      } = surveyDetail;

      form.setFieldsValue({
        ...restUserDetail,

        startDate: dayjs(originalStartDate),
        endDate: originalEndDate ? dayjs(originalEndDate) : null,
        questions: questions?.map((question: any) => ({
          ...question,
          extraOptions: question.extraOptions || [
            { option: '' },
            { option: '' },
          ],
        })),
      });
    }
  }, [surveyDetail, form]);

  const onStartChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const disabledEndDate = (current: Dayjs | null) => {
    return current && startDate && current.isBefore(startDate, 'day');
  };

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    form.resetFields(['questions', 'totalContent']);
  };

  const validateEndDate = (value: any) => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');

    if (!value || !endDate) {
      return Promise.resolve();
    }
    if (dayjs(endDate).isBefore(startDate, 'day')) {
      return Promise.reject(
        new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      );
    }
    return Promise.resolve();
  };

  return (
    <Flex vertical gap={20}>
      <Card title='Thông tin chung'>
        <Descriptions column={1} style={{ width: '100%' }} bordered>
          <Descriptions.Item label='Tên khảo sát'>
            <Form.Item
              style={{ width: '100%' }}
              name='surveyName'
              rules={[
                { required: true, message: 'Vui lòng nhập tên khảo sát' },
              ]}
              colon={false}
            >
              <Input placeholder='Nhập tên khảo sát' />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Điểm thưởng'>
            <Form.Item
              style={{ width: '100%' }}
              name='averageScore'
              rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}
              colon={false}
            >
              <InputNumber
                min={0}
                placeholder='Nhập điểm thưởng'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Ngày bắt đầu'>
            <Form.Item
              name='startDate'
              rules={[
                { required: true, message: 'Vui lòng nhập ngày bắt đầu' },
              ]}
              colon={false}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format='DD/MM/YYYY - HH:mm'
                onChange={onStartChange}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs().startOf('day'))
                }
                placeholder='Ngày bắt đầu'
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Ngày kết thúc'>
            <Form.Item
              name='endDate'
              rules={[{ validator: validateEndDate }]}
              colon={false}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format='DD/MM/YYYY - HH:mm'
                disabledDate={(current) => {
                  if (!current) {
                    return false;
                  }
                  return (
                    (current.isBefore(dayjs().startOf('day')) ||
                      disabledEndDate(current)) ??
                    false
                  );
                }}
                placeholder='Ngày kết thúc'
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Tổng nội dung khảo sát'>
            <Form.Item
              name='totalContent'
              colon={false}
              style={{ width: '100%' }}
            >
              <InputNumber
                disabled={true}
                style={{ width: '100%' }}
                defaultValue={0}
              />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title='Nội dung khảo sát'>
        <Form.List name='questions'>
          {(fields, { add, remove }) => (
            <>
              <Popconfirm
                title='Xóa tất cả khảo sát'
                description='Bạn có chắc chắn muốn xóa tất cả khảo sát?'
                onConfirm={confirm}
                okText='Yes'
                cancelText='No'
              >
                <Button
                  icon={<RedoOutlined />}
                  style={{
                    position: 'absolute',
                    right: '160px',
                    top: '10px',
                    border: '1px solid var(--main-color)',
                  }}
                >
                  Xóa tất cả
                </Button>
              </Popconfirm>

              <Button
                onClick={() => {
                  add({}, 0);
                  const currentTotalContent =
                    form.getFieldValue('totalContent') || 0;
                  form.setFieldValue('totalContent', currentTotalContent + 1);
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '10px',
                  backgroundColor: 'var(--main-color)',
                  color: '#fff',
                }}
              >
                + Thêm câu hỏi
              </Button>
              {fields.map(({ key, name, ...restField }) => {
                const questionType = form.getFieldValue([
                  'questions',
                  name,
                  'questionType',
                ]);
                return (
                  <div key={key}>
                    <QuestionFormItem
                      key={key}
                      fieldName={name}
                      restField={restField}
                      remove={remove}
                      qtyField={fields.length}
                      questionType={questionType}
                      add={add}
                      form={form}
                    />
                  </div>
                );
              })}
            </>
          )}
        </Form.List>
      </Card>
    </Flex>
  );
};

export default SurveyFormInfo;
