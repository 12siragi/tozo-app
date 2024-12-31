import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

interface NavbarLinkProps {
  href: string;
  label: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, label }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={`text-white hover:text-gray-300 focus:text-gray-300 transition duration-200 ${isActive ? 'text-blue-300' : ''}`}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-blue-500 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img
          src="/images.png"
          alt="Tozo Logo"
          className="h-8 w-8 object-contain"
        />
        <span className="text-2xl font-semibold">Tozo</span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden text-white focus:outline-none"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Navigation Links */}
      <ul
        className={`lg:flex lg:space-x-6 ${isMenuOpen ? 'absolute bg-blue-500 left-0 right-0 top-16 px-6 py-4 block' : 'hidden'} transition-all duration-300 ease-in-out lg:block lg:static`}
        aria-expanded={isMenuOpen ? "true" : "false"}
      >
        <NavbarLink href="/create-task" label="Create Task" />
        <NavbarLink href="/task-list" label="Task List" />
        <NavbarLink href="/login" label="Login" />
        <NavbarLink href="/register" label="Register" />
        <NavbarLink href="/password-reset" label="Password Reset" />
        <NavbarLink href="/change-password" label="Change Password" />
        <NavbarLink href="/tasks" label="Tasks" />
        
        {/* Logout Button */}
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
