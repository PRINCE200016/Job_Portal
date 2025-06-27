import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser, AiOutlineDashboard, AiOutlineLogout } from 'react-icons/ai';
import { FiSun, FiMoon } from 'react-icons/fi';
import { BiSearchAlt } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { logout } from '../../redux/slices/authSlice';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Determine if user is a job seeker, recruiter, or admin
  const isJobSeeker = isAuthenticated && user?.role === 'jobseeker';
  const isRecruiter = isAuthenticated && user?.role === 'recruiter';
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <BsBriefcase className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">Jobify</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400">
                Home
              </NavLink>
              <NavLink to="/jobs" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400">
                Find Jobs
              </NavLink>
              
              {isAuthenticated && (
                <NavLink to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400">
                  Dashboard
                </NavLink>
              )}
              
              {isRecruiter && (
                <NavLink to="/jobs/create" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400">
                  Post a Job
                </NavLink>
              )}
            </nav>
            
            {/* Right side menu (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <FiSun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <FiMoon className="h-5 w-5 text-gray-700" />
                )}
              </button>
              
              {/* User menu (if authenticated) */}
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <AiOutlineUser className="h-5 w-5" />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  
                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-20">
                      <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Profile
                      </NavLink>
                      <NavLink to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Dashboard
                      </NavLink>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink to="/login" className="px-4 py-2 text-primary-500 hover:text-primary-600">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">
                    Register
                  </NavLink>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 pb-4 px-4">
            <nav className="flex flex-col space-y-4">
              <NavLink 
                to="/"
                className="text-gray-700 dark:text-gray-200 py-2 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/jobs"
                className="text-gray-700 dark:text-gray-200 py-2 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                Find Jobs
              </NavLink>
              
              {isAuthenticated && (
                <NavLink 
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-200 py-2 hover:text-primary-500 dark:hover:text-primary-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}
              
              {isRecruiter && (
                <NavLink 
                  to="/jobs/create"
                  className="text-gray-700 dark:text-gray-200 py-2 hover:text-primary-500 dark:hover:text-primary-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Post a Job
                </NavLink>
              )}
              
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <NavLink 
                    to="/login"
                    className="py-2 text-center text-primary-500 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register"
                    className="py-2 text-center bg-primary-500 text-white rounded hover:bg-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <NavLink 
                    to="/profile"
                    className="py-2 text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="py-2 text-left text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {/* Theme toggle in mobile menu */}
              <div className="flex items-center py-2">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                >
                  {theme === 'dark' ? (
                    <>
                      <FiSun className="h-5 w-5 text-yellow-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <BsBriefcase className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-primary-600">Jobify</span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Find your dream job with ease
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">For Job Seekers</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Browse Jobs</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Create Profile</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Job Alerts</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">For Employers</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Post a Job</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Browse Candidates</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Pricing</a>
                  </li>
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="text-gray-600 dark:text-gray-300">
                    Email: info@jobify.com
                  </li>
                  <li className="text-gray-600 dark:text-gray-300">
                    Phone: +1 (555) 123-4567
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-300">
              &copy; {new Date().getFullYear()} Jobify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 