import { Form, message } from 'antd';
import React from 'react';
import SurveyFormInfo from './SurveyFormInfo';
import { useForm } from 'antd/es/form/Form';
import useSurvey from 'hooks/useSurvey';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const SurveyCreate: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { surveyList, addNewSurvey } = useSurvey();

  const handleSubmit = (values: any) => {
    try {
      values.questions = (values.questions || []).map((question: any) => {
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

      values.originalStartDate = values.startDate;
      values.originalEndDate = values.endDate;

      values.id = surveyList.length + 1;
      values.totalContent = values?.questions?.length ?? 0;

      const startDate = dayjs(values.startDate);
      const endDate = values.endDate ? dayjs(values.endDate) : undefined;

      values.startDate = startDate.format('DD/MM/YYYY');

      if (endDate && endDate.isBefore(startDate, 'day')) {
        message.error('Ngày kết thúc không được sớm hơn ngày bắt đầu');
        return;
      }

      values.endDate = endDate ? endDate.format('DD/MM/YYYY') : undefined;

      addNewSurvey(values);
      message.success('Tạo mới thành công');
      navigate('/surveys');
    } catch (error) {
      console.log('Submit failed', error);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <SurveyFormInfo form={form} />
    </Form>
  );
};

export default SurveyCreate;
