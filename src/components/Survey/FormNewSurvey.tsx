import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { customizeRequiredMark } from 'utils';
import { useNavigate } from 'react-router-dom';
import QuestionFormItem from './QuestionFormItem';

const { Item, List } = Form;
const { Option } = Select;

const FormNewSurvey: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    values.totalContent = values.questions.length;
    console.log(values);
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 250px)',
      }}
    >
      <Form
        form={form}
        autoComplete='false'
        onFinish={handleSubmit}
        layout='horizontal'
        requiredMark={customizeRequiredMark}
      >
        <div style={{ backgroundColor: 'whitesmoke', padding: '20px' }}>
          <Item
            name='surveyName'
            label='Tên khảo sát'
            colon={false}
            rules={[{ required: true, message: 'Vui lòng nhập tên khảo sát' }]}
          >
            <Input />
          </Item>
          <Item
            name='averageScore'
            label='Điểm thưởng'
            colon={false}
            rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Item>
          <Item
            name='startDate'
            label='Ngày bắt đầu'
            colon={false}
            rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf('day'))
              }
              style={{ borderRadius: '14px' }}
            />
          </Item>
          <Item name='endDate' label='Ngày kết thúc' colon={false}>
            <DatePicker
              format='DD/MM/YYYY'
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf('day'))
              }
              style={{ borderRadius: '14px' }}
            />
          </Item>
          <Item
            name='totalContent'
            label='Tổng nội dung khảo sát'
            colon={false}
          >
            <InputNumber
              disabled={true}
              style={{ width: '100%', borderRadius: '14px' }}
            />
          </Item>
        </div>
        <div
          style={{
            backgroundColor: 'whitesmoke',
            border: '1px solid lightblue',
            position: 'relative',
            minHeight: '250px',
          }}
        >
          <Item>
            <Typography.Paragraph
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: '0',
                padding: '8px 24px',
              }}
            >
              Nội dung khảo sát
            </Typography.Paragraph>

            <Divider style={{ margin: '10px 0' }} />
            <div style={{ padding: '8px 24px' }}>
              <List name='questions'>
                {(fields, { add, remove }) => (
                  <>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '10px',
                      }}
                    >
                      Tạo câu hỏi
                    </Button>
                    {fields.map(({ key, name, ...restField }) => (
                      <QuestionFormItem
                        countFields={fields}
                        key={key}
                        fieldKey={key}
                        fieldName={name}
                        restField={restField}
                        remove={remove}
                      />
                    ))}
                  </>
                )}
              </List>
            </div>
          </Item>
        </div>
        <Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: '10px',
          }}
        >
          <Button
            htmlType='button'
            style={{ marginRight: '10px' }}
            onClick={() => navigate('/surveys')}
          >
            Hủy bỏ
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            style={{ backgroundColor: 'var(--main-color)' }}
          >
            Tạo mới
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default FormNewSurvey;
