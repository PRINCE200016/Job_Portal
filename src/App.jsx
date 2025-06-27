import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages 
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import JobDetails from './pages/JobDetails'
import PostJob from './pages/PostJob'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import JobApplications from './pages/JobApplications'
import Unauthorized from './pages/Unauthorized'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import { setTheme } from './redux/slices/uiSlice'

function App() {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.ui)
  
  // Set theme on initial load and when theme changes
  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <ToastContainer position="top-right" theme={theme} />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes - Any Role */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Protected Routes - Job Seeker */}
            <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
              <Route path="applications" element={<Applications />} />
            </Route>
            
            {/* Protected Routes - Recruiter */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="post-job" element={<PostJob />} />
              <Route path="edit-job/:id" element={<PostJob />} />
              <Route path="job-applications/:id" element={<JobApplications />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App 