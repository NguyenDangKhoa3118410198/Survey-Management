import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from 'components/Login';
import MainLayout from 'layout';
import LayoutManagement from 'layout/LayoutManagement';
import UserList from 'components/User/UserList';
import NewUser from 'components/User/NewUser';
import SurveyList from 'components/Survey/SurveyList';
import NewSurvey from 'components/Survey/NewSurvey';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<MainLayout />}>
          <Route element={<LayoutManagement />}>
            <Route path='/users' element={<UserList />} />
            <Route path='/users/create' element={<NewUser />} />
            <Route path='/surveys' element={<SurveyList />} />
            <Route path='/surveys/create' element={<NewSurvey />} />
          </Route>
        </Route>
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
