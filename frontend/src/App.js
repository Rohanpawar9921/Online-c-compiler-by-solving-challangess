import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChallengeBrowser from './components/ChallengeBrowser';
import ProgressDashboard from './components/ProgressDashboard';
import Compiler from './components/Compiler';
import AuthForm from './components/AuthForm';
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import './styles/components.css';

function App() {
  const [user, setUser] = useState(null);

  // Add state synchronization for authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setUser(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">C Compiler</Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/challenges">Challenges</Link>
                <Link to="/dashboard">Progress</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUser(false);
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={
          !user ? <LandingPage /> : <Navigate to="/compiler" replace />
        } />

        {/* Authenticated Routes */}
        <Route path="/compiler" element={
          user ? <Compiler /> : <Navigate to="/login" replace />
        }/>
        <Route path="/challenges" element={
          user ? <ChallengeBrowser /> : <Navigate to="/login" replace />
        }/>
        <Route path="/dashboard" element={
          user ? <ProgressDashboard /> : <Navigate to="/login" replace />
        }/>
        <Route path="/compile/:challengeId" element={
          user ? <Compiler /> : <Navigate to="/login" replace />
        }/>

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthForm isLogin={true} setUser={setUser} />} />
        <Route path="/register" element={<AuthForm isLogin={false} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
