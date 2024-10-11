import { useQuery } from '@tanstack/react-query';
import { ISurvey } from 'hooks/useSurvey';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSurveybyId } from './services/fecthAPI';
import { Divider, Typography } from 'antd';
import FormNewSurvey from './FormNewSurvey';

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: surveyDetail,
    isLoading,
    isError,
  } = useQuery<ISurvey | undefined>({
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

  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: 'calc(100vh - 150px)',
        overflowY: 'auto',
      }}
    >
      <Typography.Paragraph
        style={{
          fontSize: '18px',
          fontWeight: '700',
          margin: '0',
          padding: '8px 24px',
        }}
      >
        Thông tin chung
      </Typography.Paragraph>
      <Divider style={{ margin: '10px 0' }} />
      <div style={{ padding: '8px 24px' }}>
        <FormNewSurvey surveyDetail={memoizedSurveyDetail} />
      </div>
    </div>
  );
};

export default SurveyDetail;
