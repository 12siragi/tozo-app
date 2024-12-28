import React, { useState } from 'react';
import { register } from '../api/authAPI';

const RegisterForm = ({ onRegisterSuccess }: { onRegisterSuccess: () => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Complex password validation
  const validatePassword = (password: string) => {
    const minLength = 8;  // Minimum length for password
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;  // Regex for special characters
    const uppercaseRegex = /[A-Z]/;  // Regex for uppercase letters
    const lowercaseRegex = /[a-z]/;  // Regex for lowercase letters
    const numberRegex = /[0-9]/;  // Regex for numbers

    // Check password length
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    
    // Check if password contains at least one special character
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character (e.g., !, @, #, $, etc.).';
    }

    // Check if password contains at least one uppercase letter, one lowercase letter, and one number
    if (!uppercaseRegex.test(password) && !lowercaseRegex.test(password)) {
      return 'Password must contain at least one uppercase letter (A-Z) and one lowercase letter (a-z).';
    }

    if (!numberRegex.test(password)) {
      return 'Password must contain at least one number (0-9).';
    }

    return '';  // Return an empty string if validation passes
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Check if passwords match
    if (password1 !== password2) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password
    const passwordError = validatePassword(password1);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await register({ username, email, password1, password2 });
      console.log('Registration successful:', response.data);

      setSuccess(true);
      setUsername('');
      setEmail('');
      setPassword1('');
      setPassword2('');

      onRegisterSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6"
    >
      <h2 className="text-2xl font-extrabold text-gray-900 text-center">Create an Account</h2>

      {success && (
        <div className="p-4 text-sm text-green-800 bg-green-100 rounded-lg">
          Registration successful! You can now log in.
        </div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Enter your password"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
          required
        />
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters long, contain at least one special character, one uppercase letter, one lowercase letter, and one number.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Confirm your password"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2.5 text-white font-medium rounded-lg shadow-sm transition-all text-sm ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300'
        }`}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Log in
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
