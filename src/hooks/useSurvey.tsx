import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ISurvey {
   id?: number;
   surveyName: string;
   averageScore: number;
   startDate: string;
   endDate: string;
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
}
interface IOption {
   option: string;
}
interface IUseSurvey {
   surveyList: ISurvey[];
   setSurveyList: (surveyList: ISurvey[]) => void;
   addNewSurvey: (survey: ISurvey) => void;
}

const useSurvey = create<IUseSurvey>()(
   persist(
      (set) => ({
         surveyList: [],
         setSurveyList: (surveyList: ISurvey[]) => set({ surveyList }),
         addNewSurvey: (newSurvey: ISurvey) =>
            set((state) => ({ surveyList: [...state.surveyList, newSurvey] })),
      }),
      {
         name: 'surveyList',
      }
   )
);

export default useSurvey;
