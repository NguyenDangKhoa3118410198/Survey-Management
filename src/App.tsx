import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from 'components/Login';
import MainLayout from 'layout';
import PrivateRoute from 'components/PrivateRoute';
import SurveyList from 'components/SurveyList';
import UserList from 'components/UserList';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<MainLayout />}>
          <Route
            path='/users'
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path='/surveys'
            element={
              <PrivateRoute>
                <SurveyList />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
