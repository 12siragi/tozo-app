import React, { useState } from 'react';
import { requestPasswordReset } from '../api/authAPI'; // Corrected import for the password reset API function

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // State to store email input
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to handle loading state
  const [message, setMessage] = useState<string | null>(null); // State for success or error messages

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set loading state
    setMessage(null); // Clear any previous messages

    try {
      await requestPasswordReset(email); // Call the API with the email
      setMessage('Password reset instructions have been sent to your email.'); // Success message
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to send password reset instructions. Please try again.'); // Error message
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Password Reset</h2>
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-md ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isSubmitting ? 'Submitting...' : 'Send Reset Instructions'}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-gray-700">{message}</div>}
    </div>
  );
};

export default PasswordReset;
