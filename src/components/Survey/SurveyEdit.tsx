import { Button, Flex, Form, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import SurveyFormInfo from './SurveyFormInfo';
import { useForm } from 'antd/es/form/Form';
import useSurvey from 'hooks/useSurvey';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSurveybyId } from './services/fecthAPI';

const SurveyEdit: React.FC = () => {
  const { id } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();
  const { editSurvey } = useSurvey();
  const [isChange, setIsChange] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [originalQuestions, setOriginalQuestions] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);

  const handleValueChange = () => {
    setIsChange(true);
  };

  const {
    data: surveyDetail,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ['userSurvey', id],
    queryFn: () => (id ? fetchSurveybyId(id) : undefined),
  });

  const refetchSurvey = async () => {
    if (id) {
      await queryClient.refetchQueries({ queryKey: ['userSurvey', id] });
    }
  };

  useEffect(() => {
    if (!isLoading && surveyDetail === undefined) {
      navigate('/404');
    }
  }, [id, surveyDetail, isLoading, isError, navigate]);

  const memoizedSurveyDetail = useMemo(() => surveyDetail, [surveyDetail]);

  const handleSubmit = async (values: any) => {
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
        editSurvey(values);
        await refetchSurvey();
        message.success('Chỉnh sửa thành công');
      } catch (error) {
        console.log('Edit failed', error);
      }
    }
  };

  const handleReset = () => {
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
      setTreeData(originalQuestions);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onValuesChange={handleValueChange}
    >
      <SurveyFormInfo
        form={form}
        surveyDetail={memoizedSurveyDetail}
        setOriginalQuestions={setOriginalQuestions}
        setTreeData={setTreeData}
        treeData={treeData}
      />
      {isChange && (
        <Flex justify='flex-end' style={{ margin: 10 }}>
          <Button
            htmlType='button'
            style={{ marginRight: '10px' }}
            onClick={handleReset}
          >
            Hủy bỏ
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            style={{ backgroundColor: 'var(--main-color)' }}
          >
            Cập nhật
          </Button>
        </Flex>
      )}
    </Form>
  );
};

export default SurveyEdit;
