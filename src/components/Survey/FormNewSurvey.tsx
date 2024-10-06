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
   const { surveyList, addNewSurvey } = useSurvey();
   const [startDate, setStartDate] = useState<Dayjs | null>(null);

   const onStartChange = (date: Dayjs | null) => {
      setStartDate(date);
   };

   const disabledEndDate = (current: Dayjs | null) => {
      return current && startDate && current.isBefore(startDate, 'day');
   };
   const handleSubmit = (values: ISurvey) => {
      try {
         values.totalContent = values?.questions?.length ?? 0;
         values.id = surveyList.length + 1;
         const formattedStartDate = dayjs(values.startDate).format(
            'DD/MM/YYYY'
         );
         const formattedEndDate = dayjs(values.endDate).format('DD/MM/YYYY');
         values.startDate = formattedStartDate;
         values.endDate = formattedEndDate;

         console.log(values);
         addNewSurvey(values);
         navigate('/surveys');
      } catch (error) {
         console.log('Submit failed');
      }
   };

   useEffect(() => {
      if (surveyDetail) {
         const { startDate, endDate, questions, ...restUserDetail } =
            surveyDetail;
         form.setFieldsValue({
            ...restUserDetail,
            startDate: dayjs(startDate, 'DD/MM/YYYY'),
            endDate: dayjs(endDate, 'DD/MM/YYYY'),
            questions: questions.map((question) => ({
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
                  rules={[
                     { required: true, message: 'Vui lòng nhập tên khảo sát' },
                  ]}
               >
                  <Input />
               </Item>
               <Item
                  name='averageScore'
                  label='Điểm thưởng'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập điểm thưởng' },
                  ]}
               >
                  <InputNumber min={0} style={{ width: '100%' }} />
               </Item>
               <Item
                  name='startDate'
                  label='Ngày bắt đầu'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập ngày bắt đầu' },
                  ]}
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
