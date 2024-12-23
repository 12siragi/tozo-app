import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
//import PasswordResetPage from './pages/PasswordResetPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import CreateTask from './components/CreateTask';

// A mock authentication check function
const isAuthenticated = (): boolean => {
  return localStorage.getItem('access_token') !== null;
};

// Private route component that redirects to login if not authenticated
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        {/* Navbar outside of Routes so it shows on every page */}
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
         <Route path="change-password" element={<ChangePasswordPage />} />

          {/* Private Routes (only accessible if authenticated) */}
          <Route path="/" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
          <Route path="create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />

          {/* Catch-all Route for 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
