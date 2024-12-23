// LogoutButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the auth data (e.g., token from localStorage)
    localStorage.removeItem('authToken'); // Adjust as needed
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:text-gray-300 focus:text-gray-300 transition duration-200"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
