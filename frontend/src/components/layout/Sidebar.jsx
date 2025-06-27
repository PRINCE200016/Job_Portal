import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaBriefcase, FaClipboardList, FaUserCircle, FaPlus, FaChartBar } from 'react-icons/fa';
import { setSidebarOpen } from '../../redux/slices/uiSlice';

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false));
    }
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      {
        to: '/dashboard',
        icon: <FaHome />,
        text: 'Dashboard',
      },
      {
        to: '/profile',
        icon: <FaUserCircle />,
        text: 'Profile',
      },
    ];

    const jobSeekerLinks = [
      {
        to: '/',
        icon: <FaBriefcase />,
        text: 'Browse Jobs',
      },
      {
        to: '/applications',
        icon: <FaClipboardList />,
        text: 'My Applications',
      },
    ];

    const recruiterLinks = [
      {
        to: '/post-job',
        icon: <FaPlus />,
        text: 'Post New Job',
      },
      {
        to: '/my-jobs',
        icon: <FaBriefcase />,
        text: 'My Jobs',
      },
      {
        to: '/stats',
        icon: <FaChartBar />,
        text: 'Statistics',
      },
    ];

    if (user.role === 'jobseeker') {
      return [...commonLinks, ...jobSeekerLinks];
    } else if (user.role === 'recruiter') {
      return [...commonLinks, ...recruiterLinks];
    }

    return commonLinks;
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen pt-16 transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } md:w-64`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {getNavLinks().map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span className="ml-3">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 