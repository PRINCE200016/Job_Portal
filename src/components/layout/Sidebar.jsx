import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  MdDashboard, 
  MdWork, 
  MdPersonOutline, 
  MdOutlineDescription,
  MdAdd,
  MdLogout
} from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isRecruiter = user && user.role === 'recruiter';
  const isJobSeeker = user && user.role === 'jobseeker';
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-gray-800 shadow-md transition-all duration-300 z-10 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <MdDashboard className="w-6 h-6" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </NavLink>
            </li>
            
            {isRecruiter && (
              <>
                <li>
                  <NavLink
                    to="/post-job"
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-lg ${
                        isActive 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <MdAdd className="w-6 h-6" />
                    {sidebarOpen && <span className="ml-3">Post Job</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-lg ${
                        isActive 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <MdWork className="w-6 h-6" />
                    {sidebarOpen && <span className="ml-3">My Jobs</span>}
                  </NavLink>
                </li>
              </>
            )}
            
            {isJobSeeker && (
              <li>
                <NavLink
                  to="/applications"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <MdOutlineDescription className="w-6 h-6" />
                  {sidebarOpen && <span className="ml-3">Applications</span>}
                </NavLink>
              </li>
            )}
            
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <MdPersonOutline className="w-6 h-6" />
                {sidebarOpen && <span className="ml-3">Profile</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MdLogout className="w-6 h-6" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 