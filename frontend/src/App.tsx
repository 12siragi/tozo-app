import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage'; 
import NotFoundPage from './pages/NotFoundPage'; 
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage'; 
import TaskList from './components/TaskList'; 
import CreateTask from './components/CreateTask';
//import SingleTask from './components/SingleTask.tsx';
//import PasswordResetPage from './pages/PasswordResetPage';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        {/* Navbar outside of Routes so it shows on every page */}
        <Navbar />
        <Routes>
          {/* Add Register route */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="Change-password" element={<ChangePasswordPage />} />

          <Route path="tasks" element={<TaskList />} />
          
          <Route path="create-task" element={<CreateTask />} /> 
          {/* You can add other routes here as well */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
