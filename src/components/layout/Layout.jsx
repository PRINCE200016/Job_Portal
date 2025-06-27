import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser, AiOutlineDashboard, AiOutlineLogout } from 'react-icons/ai';
import { FiSun, FiMoon } from 'react-icons/fi';
import { BiSearchAlt } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { logout } from '../../redux/slices/authSlice';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
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
    <>
      <Header />
      <div className="flex min-h-screen">
        {user && <Sidebar />}
        <main className={`flex-grow p-4 transition-all duration-300 ${user ? (sidebarOpen ? 'md:ml-64' : 'md:ml-16') : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout; 