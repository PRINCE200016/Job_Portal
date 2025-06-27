import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { BsBriefcase } from 'react-icons/bs';
import { AiOutlineUser, AiOutlineClose } from 'react-icons/ai';
import { logout } from '../../redux/slices/authSlice';
import { setTheme, toggleSidebar } from '../../redux/slices/uiSlice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isRecruiter = user && user.role === 'recruiter';
  const isJobSeeker = user && user.role === 'jobseeker';
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const toggleThemeHandler = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {user && (
              <button 
                onClick={handleSidebarToggle}
                className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            )}
            <NavLink to="/" className="flex items-center space-x-2">
              <BsBriefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">Jobify</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                isActive 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              }
            >
              Home
            </NavLink>
            
            {user && (
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                }
              >
                Dashboard
              </NavLink>
            )}
            
            {isRecruiter && (
              <NavLink 
                to="/post-job" 
                className={({isActive}) => 
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                }
              >
                Post a Job
              </NavLink>
            )}
          </nav>
          
          {/* Right side menu (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme toggle */}
            <button 
              onClick={toggleThemeHandler}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            {/* User menu (if authenticated) */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <AiOutlineUser className="h-5 w-5" />
                  <span>{user.name || 'User'}</span>
                </button>
                
                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-20">
                    <NavLink 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink 
                      to="/dashboard" 
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    {isJobSeeker && (
                      <NavLink 
                        to="/applications" 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Applications
                      </NavLink>
                    )}
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
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 text-blue-500 hover:text-blue-600"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <AiOutlineClose className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
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
              className={({isActive}) => 
                isActive 
                  ? "text-blue-600 dark:text-blue-400 py-2" 
                  : "text-gray-700 dark:text-gray-200 py-2 hover:text-blue-500 dark:hover:text-blue-400"
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            
            {user && (
              <NavLink 
                to="/dashboard"
                className={({isActive}) => 
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 py-2" 
                    : "text-gray-700 dark:text-gray-200 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                }
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            
            {isRecruiter && (
              <NavLink 
                to="/post-job"
                className={({isActive}) => 
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 py-2" 
                    : "text-gray-700 dark:text-gray-200 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                }
                onClick={() => setMenuOpen(false)}
              >
                Post a Job
              </NavLink>
            )}
            
            {!user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <NavLink 
                  to="/login"
                  className="py-2 text-center text-blue-500 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register"
                  className="py-2 text-center bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <NavLink 
                  to="/profile"
                  className="py-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>
                {isJobSeeker && (
                  <NavLink 
                    to="/applications"
                    className="py-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Applications
                  </NavLink>
                )}
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
                onClick={() => {
                  toggleThemeHandler();
                  setMenuOpen(false);
                }}
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
  );
};

export default Header; 