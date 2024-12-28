import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-4">404 - Page Not Found</h1>
        <p className="text-lg sm:text-xl mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/login"
          className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-md transition-all duration-300 ease-in-out"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
