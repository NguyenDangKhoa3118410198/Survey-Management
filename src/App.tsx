import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from 'components/Login';
import MainLayout from 'layout';
import Users from 'components/Users';
import PrivateRoute from 'components/PrivateRoute';
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
                <Users />
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
