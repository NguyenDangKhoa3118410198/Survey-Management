import { Form, message } from 'antd';
import React, { useEffect, useMemo } from 'react';
import SurveyFormInfo from './SurveyFormInfo';
import { useForm } from 'antd/es/form/Form';
import useSurvey from 'hooks/useSurvey';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSurveybyId } from './services/fecthAPI';

const SurveyEdit: React.FC = () => {
  const { id } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();
  const { editSurvey } = useSurvey();

  const {
    data: surveyDetail,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ['userSurvey', id],
    queryFn: () => (id ? fetchSurveybyId(id) : undefined),
    enabled: !!id,
  });

  useEffect(() => {
    if (!isLoading && surveyDetail === undefined) {
      navigate('/404');
    }
  }, [id, surveyDetail, isLoading, isError, navigate]);

  const memoizedSurveyDetail = useMemo(() => surveyDetail, [surveyDetail]);

  const handleSubmit = (values: any) => {
    values.id = Number(id);
    if (id) {
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
        console.log(values);
        editSurvey(values);
        message.success('Chỉnh sửa thành công');
        navigate('/surveys');
      } catch (error) {
        console.log('Edit failed', error);
      }
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <SurveyFormInfo form={form} surveyDetail={memoizedSurveyDetail} />
    </Form>
  );
};

export default SurveyEdit;
