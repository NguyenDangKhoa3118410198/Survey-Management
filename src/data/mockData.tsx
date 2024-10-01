interface User {
  id: number;
  avatar: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface Survey {
  id: number;
  surveyName: string;
  averageScore: number;
  startDate: string;
  endDate: string;
  totalContent: number;
}

export const mockUserListData: User[] = [
  {
    id: 1,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    birthDate: '01/01/1990',
    gender: 'Nam',
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    fullName: 'Trần Thị B',
    email: 'tranb@example.com',
    birthDate: '02/02/1992',
    gender: 'Nữ',
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    fullName: 'Lê Văn C',
    email: 'levanc@example.com',
    birthDate: '03/03/1988',
    gender: 'Nam',
  },
  {
    id: 4,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    fullName: 'Phạm Thị D',
    email: 'phamthid@example.com',
    birthDate: '04/04/1995',
    gender: 'Nữ',
  },
  {
    id: 5,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    fullName: 'Hoàng Văn E',
    email: 'hoange@example.com',
    birthDate: '05/05/1985',
    gender: 'Nam',
  },
  {
    id: 6,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    fullName: 'Nguyễn Thị F',
    email: 'nguyenthif@example.com',
    birthDate: '06/06/1993',
    gender: 'Nữ',
  },
  {
    id: 7,
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    fullName: 'Trần Văn G',
    email: 'trangg@example.com',
    birthDate: '07/07/1989',
    gender: 'Nam',
  },
  {
    id: 8,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    fullName: 'Lê Thị H',
    email: 'lethih@example.com',
    birthDate: '08/08/1994',
    gender: 'Nữ',
  },
  {
    id: 9,
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    fullName: 'Phạm Văn I',
    email: 'phami@example.com',
    birthDate: '09/09/1987',
    gender: 'Nam',
  },
  {
    id: 10,
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    fullName: 'Nguyễn Thị J',
    email: 'nguyenthi@example.com',
    birthDate: '10/10/1991',
    gender: 'Nữ',
  },
  {
    id: 11,
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    fullName: 'Lê Văn K',
    email: 'levank@example.com',
    birthDate: '11/11/1986',
    gender: 'Nam',
  },
  {
    id: 12,
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    fullName: 'Trần Thị L',
    email: 'tranl@example.com',
    birthDate: '12/12/1995',
    gender: 'Nữ',
  },
  {
    id: 13,
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    fullName: 'Nguyễn Văn M',
    email: 'nguyenm@example.com',
    birthDate: '13/01/1988',
    gender: 'Nam',
  },
  {
    id: 14,
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    fullName: 'Phạm Thị N',
    email: 'phamn@example.com',
    birthDate: '14/02/1992',
    gender: 'Nữ',
  },
  {
    id: 15,
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    fullName: 'Lê Văn O',
    email: 'levano@example.com',
    birthDate: '15/03/1994',
    gender: 'Nam',
  },
];

export const mockSurveyListData: Survey[] = [
  {
    id: 1,
    surveyName: 'Khảo sát 1',
    averageScore: 85,
    startDate: '01/01/2024',
    endDate: '31/01/2024',
    totalContent: 10,
  },
  {
    id: 2,
    surveyName: 'Khảo sát 2',
    averageScore: 90,
    startDate: '01/02/2024',
    endDate: '28/02/2024',
    totalContent: 15,
  },
  {
    id: 3,
    surveyName: 'Khảo sát 3',
    averageScore: 78,
    startDate: '01/03/2024',
    endDate: '31/03/2024',
    totalContent: 12,
  },
  {
    id: 4,
    surveyName: 'Khảo sát 4',
    averageScore: 92,
    startDate: '01/04/2024',
    endDate: '30/04/2024',
    totalContent: 8,
  },
  {
    id: 5,
    surveyName: 'Khảo sát 5',
    averageScore: 76,
    startDate: '01/05/2024',
    endDate: '31/05/2024',
    totalContent: 20,
  },
  {
    id: 6,
    surveyName: 'Khảo sát 6',
    averageScore: 89,
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    totalContent: 14,
  },
  {
    id: 7,
    surveyName: 'Khảo sát 7',
    averageScore: 81,
    startDate: '01/07/2024',
    endDate: '31/07/2024',
    totalContent: 10,
  },
  {
    id: 8,
    surveyName: 'Khảo sát 8',
    averageScore: 84,
    startDate: '01/08/2024',
    endDate: '31/08/2024',
    totalContent: 16,
  },
  {
    id: 9,
    surveyName: 'Khảo sát 9',
    averageScore: 87,
    startDate: '01/09/2024',
    endDate: '30/09/2024',
    totalContent: 18,
  },
  {
    id: 10,
    surveyName: 'Khảo sát 10',
    averageScore: 88,
    startDate: '01/10/2024',
    endDate: '31/10/2024',
    totalContent: 25,
  },
  {
    id: 11,
    surveyName: 'Khảo sát 11',
    averageScore: 80,
    startDate: '01/11/2024',
    endDate: '30/11/2024',
    totalContent: 22,
  },
  {
    id: 12,
    surveyName: 'Khảo sát 12',
    averageScore: 91,
    startDate: '01/12/2024',
    endDate: '31/12/2024',
    totalContent: 30,
  },
];
