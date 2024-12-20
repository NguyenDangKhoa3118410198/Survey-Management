import { Button, Flex, Form, message } from 'antd';
import React, { useState } from 'react';
import SurveyFormInfo from './SurveyFormInfo';
import { useForm } from 'antd/es/form/Form';
import useSurvey from 'hooks/useSurvey';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const SurveyCreate: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { surveyList, addNewSurvey } = useSurvey();
  const [isChange, setIsChange] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>([]);

  const handleValueChange = () => {
    setIsChange(true);
  };

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
      values.descriptions = values.descriptions || '';

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

  const handleFinishFailed = () => {
    message.error('Vui lòng kiểm tra lại các trường bắt buộc');
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onValuesChange={handleValueChange}
      onFinishFailed={handleFinishFailed}
    >
      <SurveyFormInfo
        form={form}
        setTreeData={setTreeData}
        treeData={treeData}
      />
      {isChange && (
        <Flex justify='flex-end' style={{ margin: 10 }}>
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
        </Flex>
      )}
    </Form>
  );
};

export default SurveyCreate;
