import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from 'components/Login';
import MainLayout from 'layout';
import LayoutManagement from 'layout/LayoutManagement';
import UserList from 'components/User/UserList';
import NewUser from 'components/User/NewUser';
import SurveyList from 'components/Survey/SurveyList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDetail from 'components/User/UserDetail';
import Notfound from 'layout/Notfound';
import Profile from 'components/Profile';
import SurveyCreate from 'components/Survey/SurveyCreate';
import SurveyEdit from 'components/Survey/SurveyEdit';

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<MainLayout />}>
            <Route element={<LayoutManagement />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/users' element={<UserList />} />
              <Route path='/users/create' element={<NewUser />} />
              <Route path='/users/:id' element={<UserDetail />} />
              <Route path='/surveys' element={<SurveyList />} />
              <Route path='/surveys/create' element={<SurveyCreate />} />
              <Route path='/surveys/:id' element={<SurveyEdit />} />
            </Route>
          </Route>
          <Route path='/' element={<Login />} />
          <Route path='/*' element={<Notfound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
