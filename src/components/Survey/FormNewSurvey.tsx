import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { customizeRequiredMark } from 'utils';
import { useNavigate } from 'react-router-dom';
import QuestionFormItem from './QuestionFormItem';
import useSurvey, { ISurvey } from 'hooks/useSurvey';

const { Item, List } = Form;

interface FormNewSurveyProps {
  surveyDetail?: ISurvey;
}
const FormNewSurvey: React.FC<FormNewSurveyProps> = ({ surveyDetail }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { surveyList, addNewSurvey, editSurvey } = useSurvey();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const onStartChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const disabledEndDate = (current: Dayjs | null) => {
    return current && startDate && current.isBefore(startDate, 'day');
  };

  const handleSubmit = (values: ISurvey) => {
    try {
      const isEditing = !!surveyDetail?.id;
      if (!isEditing) {
        values.id = surveyList.length + 1;
      }
      values.totalContent = values?.questions?.length ?? 0;

      values.originalStartDate = values.startDate;
      values.originalEndDate = values.endDate;

      const startDate = dayjs(values.startDate);
      const endDate = values.endDate ? dayjs(values.endDate) : undefined;

      values.startDate = startDate.format('DD/MM/YYYY');

      if (endDate && endDate.isBefore(startDate, 'day')) {
        message.error('Ngày kết thúc không được sớm hơn ngày bắt đầu');
        return;
      }

      values.endDate = endDate ? endDate.format('DD/MM/YYYY') : undefined;

      if (isEditing) {
        values.id = surveyDetail.id;
        editSurvey(values);
        message.success('Chỉnh sửa thành công');
      } else {
        addNewSurvey(values);
        message.success('Tạo mới thành công');
      }
      navigate('/surveys');
    } catch (error) {
      console.log('Submit failed', error);
    }
  };

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

        startDate: originalStartDate,
        endDate: originalEndDate ?? null,
        questions: questions?.map((question) => ({
          ...question,
          extraOptions: question.extraOptions || [
            { option: '' },
            { option: '' },
          ],
        })),
      });
    }
  }, [surveyDetail, form]);

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
        <div
          style={{
            backgroundColor: 'whitesmoke',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
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
              onChange={onStartChange}
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf('day'))
              }
            />
          </Item>
          <Item name='endDate' label='Ngày kết thúc' colon={false}>
            <DatePicker
              format='DD/MM/YYYY'
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
            />
          </Item>
          <Item
            name='totalContent'
            label='Tổng nội dung khảo sát'
            colon={false}
          >
            <InputNumber disabled={true} style={{ width: '100%' }} />
          </Item>
        </div>
        <div
          style={{
            backgroundColor: 'whitesmoke',
            position: 'relative',
            minHeight: '320px',
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
                      onClick={() => add({}, 0)}
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
                        <QuestionFormItem
                          key={key}
                          fieldName={name}
                          restField={restField}
                          remove={remove}
                          qtyField={fields.length}
                          questionType={questionType}
                        />
                      );
                    })}
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
            style={{
              backgroundColor: 'var(--main-color)',
            }}
          >
            {surveyDetail ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default FormNewSurvey;
