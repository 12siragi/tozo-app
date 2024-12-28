import React, { useState } from 'react';
import { login } from '../api/authAPI'; // Import the login API function

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading indicator
    try {
      const response = await login({ email, password });
      console.log('Login successful:', response.data);
      setIsLoading(false); // Stop loading
      onLoginSuccess(); // Call callback after successful login
    } catch (err: any) {
      setIsLoading(false); // Stop loading
      const errorMessage = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-md mx-auto space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-gray-500 text-center">
        Please sign in to your account.
      </p>

      {/* Error Message */}
      {error && (
        <div
          className="text-red-500 bg-red-100 p-3 rounded-md text-sm flex items-center space-x-2"
          role="alert"
          aria-live="assertive"
        >
          <span className="material-icons">error_outline</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Email"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Password"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md transition-all duration-200 text-white font-medium ${
          isLoading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <span>Logging in...</span>
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : (
          'Login'
        )}
      </button>

      {/* Register Link */}
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
