// LoginForm.tsx
import React, { useState } from 'react';
import { login } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const response = await login({ email, password });
      console.log('Login successful:', response.data);
      setIsLoading(false);
      onLoginSuccess(); // Trigger the callback passed from parent
      navigate('/tasks'); // Redirect to tasks page
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
      <p className="text-gray-500 text-center">Please sign in to your account.</p>

      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded-md text-sm" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md transition-all duration-200 text-white font-medium ${
          isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
