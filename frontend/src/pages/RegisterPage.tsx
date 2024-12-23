import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleRegisterSuccess = () => {
    console.log('User registered successfully!');
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg">
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default RegisterPage;
