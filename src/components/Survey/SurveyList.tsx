import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Typography } from 'antd';
import { columns } from 'data/columnsSurveyList';
import { useNavigate } from 'react-router-dom';
import useSurvey from 'hooks/useSurvey';

const SurveyList: React.FC = () => {
  const navigate = useNavigate();
  const { surveyList } = useSurvey();
  const [filteredSurveyList, setFilteredSurveyList] = useState(surveyList);

  useEffect(() => {
    setFilteredSurveyList(surveyList);
  }, [surveyList]);

  const handleCreateSurvey = () => {
    navigate('/surveys/create');
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredList = surveyList.filter((survey) =>
      survey.surveyName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSurveyList(filteredList);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '4px 12px',
            height: '100%',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '10px 0',
            }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              Danh sách khảo sát
            </Typography.Title>

            <div>
              <Input
                placeholder='Nhập từ khóa tìm kiếm'
                allowClear
                onChange={onSearch}
                style={{
                  width: 200,
                  marginRight: '12px',
                  borderRadius: '14px',
                }}
              />

              <Button
                style={{
                  backgroundColor: 'var(--main-color)',
                  color: '#fff',
                  borderRadius: '20px',
                }}
                onClick={handleCreateSurvey}
              >
                Tạo mới
              </Button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              margin: '18px 26px 18px 18px',
            }}
          >
            <Table
              rowKey='id'
              dataSource={filteredSurveyList}
              columns={columns}
              scroll={{ y: 'calc(100vh - 360px)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
