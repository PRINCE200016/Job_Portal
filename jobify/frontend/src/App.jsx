import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

// Placeholder pages
const Home = () => <div>Home Page</div>
const Dashboard = () => <div>Dashboard Page</div>
const Login = () => <div>Login Page</div>
const Register = () => <div>Register Page</div>
const NotFound = () => <div>404 - Page Not Found</div>

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
