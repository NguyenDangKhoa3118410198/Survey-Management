import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from 'components/Login';
import MainLayout from 'layout';
import SurveyList from 'components/SurveyList';
import UserList from 'components/UserList';
import './App.css';
import NewUser from 'components/NewUser';
import LayoutManagement from 'layout/LayoutManagement';
import NewSurvey from 'components/NewSurvey';

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
