import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ISurvey {
  id: number;
  surveyName: string;
  averageScore: number;
  startDate: string;
  endDate: string;
  totalContent: number;
  listContent: any[];
}
interface IUseSurvey {
  surveyList: ISurvey[];
}

const useSurvey = create<IUseSurvey>()(
  persist(
    (set) => ({
      surveyList: [],
      setSurveyList: (surveyList: ISurvey[]) => set({ surveyList }),
    }),
    {
      name: 'surveyList',
    }
  )
);

export default useSurvey;
