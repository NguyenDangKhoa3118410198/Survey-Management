import useSurvey from 'hooks/useSurvey';

export const fetchSurveybyId = (surveyId: string) => {
  const { surveyList } = useSurvey.getState();

  const survey = surveyList.find((survey) => survey.id === Number(surveyId));

  return survey;
};

export const deleteSurveyById = (surveyId: number) => {
  const { deleteSurvey } = useSurvey.getState();

  deleteSurvey(surveyId);

  return;
};
