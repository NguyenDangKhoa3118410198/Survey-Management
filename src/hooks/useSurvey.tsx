import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ISurvey {
  id?: number;
  surveyName: string;
  averageScore: number;
  startDate: string;
  endDate: string | undefined;
  originalStartDate?: string;
  originalEndDate?: string;
  totalContent?: number;
  questions: IQuestion[];
}

interface IQuestion {
  isRequired: boolean;
  question: string;
  questionType: string;
  extraOptions?: IOption[];
  ratingOption?: number;
}
interface IOption {
  option: string;
}
interface IUseSurvey {
  surveyList: ISurvey[];
  setSurveyList: (surveyList: ISurvey[]) => void;
  addNewSurvey: (survey: ISurvey) => void;
  editSurvey: (updatedSurvey: ISurvey) => void;
  deleteSurvey: (surveyId: number) => void;
}

const useSurvey = create<IUseSurvey>()(
  persist(
    (set) => ({
      surveyList: [],
      setSurveyList: (surveyList: ISurvey[]) => set({ surveyList }),
      addNewSurvey: (newSurvey: ISurvey) =>
        set((state) => ({ surveyList: [...state.surveyList, newSurvey] })),
      editSurvey: (updatedSurvey: ISurvey) =>
        set((state) => ({
          surveyList: state.surveyList.map((survey) =>
            survey.id === updatedSurvey.id ? updatedSurvey : survey
          ),
        })),
      deleteSurvey: (surveyId: number) =>
        set((state) => ({
          surveyList: state.surveyList.filter(
            (survey) => survey.id !== surveyId
          ),
        })),
    }),
    {
      name: 'surveyList',
    }
  )
);

export default useSurvey;
