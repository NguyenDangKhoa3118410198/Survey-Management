import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { customizeRequiredMark } from 'utils';
import { useNavigate } from 'react-router-dom';
import QuestionFormItem from './QuestionFormItem';
import useSurvey, { ISurvey } from 'hooks/useSurvey';
import { RedoOutlined } from '@ant-design/icons';

const { Item, List } = Form;

interface FormNewSurveyProps {
  surveyDetail?: ISurvey;
}
const FormNewSurvey: React.FC<FormNewSurveyProps> = ({ surveyDetail }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { surveyList, addNewSurvey, editSurvey } = useSurvey();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [isFormModified, setIsFormModified] = useState<boolean>(false);

  const onStartChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const disabledEndDate = (current: Dayjs | null) => {
    return current && startDate && current.isBefore(startDate, 'day');
  };

  const submitForm = (values: ISurvey) => {
    try {
      values.questions = (values.questions || []).map((question) => {
        const updatedQuestion = { ...question };

        if (question.questionType !== 'rating') {
          delete updatedQuestion.ratingOption;
        }

        if (
          question.questionType !== 'single' &&
          question.questionType !== 'multiple'
        ) {
          delete updatedQuestion.extraOptions;
        }

        return updatedQuestion;
      });

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

        startDate: dayjs(originalStartDate),
        endDate: originalEndDate ? dayjs(originalEndDate) : null,
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

  const handleValuesChange = () => {
    setIsFormModified(true);
  };

  const showConfirm = (values: ISurvey) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin này?',
      onOk: () => submitForm(values),
      onCancel() {
        return;
      },
    });
  };

  const handleSubmit = (values: ISurvey) => {
    showConfirm(values);
  };

  const validateEndDate = (value: any) => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');

    if (!value) {
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
        initialValues={{ averageScore: 0, totalContent: 0 }}
        onValuesChange={handleValuesChange}
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
            <Input placeholder='Nhập tên khảo sát' />
          </Item>
          <Item
            name='averageScore'
            label='Điểm thưởng'
            colon={false}
            rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder='Nhập điểm thưởng'
            />
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
              placeholder='Ngày bắt đầu'
            />
          </Item>
          <Item
            name='endDate'
            label='Ngày kết thúc'
            colon={false}
            rules={[{ validator: validateEndDate }]}
          >
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
              placeholder='Ngày kết thúc'
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
                      icon={<RedoOutlined />}
                      onClick={() => {
                        form.resetFields(['questions', 'totalContent']);
                        setIsFormModified(true);
                      }}
                      style={{
                        position: 'absolute',
                        right: '160px',
                        top: '10px',
                        border: '1px solid var(--main-color)',
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => {
                        add({}, 0);
                        form.setFieldValue(
                          'totalContent',
                          form.getFieldValue('totalContent') + 1
                        );
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
              </List>
            </div>
          </Item>
        </div>
        <Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            padding: '10px 0 10px 0',
          }}
        >
          <Button
            htmlType='button'
            style={{
              marginRight: '10px',
              border: '1px solid var(--main-color)',
            }}
            onClick={() => {
              form.resetFields();
              setIsFormModified(true);
            }}
          >
            Reset
          </Button>
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
              backgroundColor: !isFormModified
                ? 'lightgray'
                : 'var(--main-color)',
            }}
            disabled={!isFormModified}
          >
            {surveyDetail ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default FormNewSurvey;
