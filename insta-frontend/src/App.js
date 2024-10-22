import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Include the spinner CSS here
import axios from './axios';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components
const Login = React.lazy(() => import('./Components/Login/Login'));
const Register = React.lazy(() => import('./Components/Register/Register'));
const Feed = React.lazy(() => import('./Components/Feed/Feed'));
const Profile = React.lazy(() => import('./Components/Profile/Profile'));
const EditProfile = React.lazy(() => import('./Components/EditProfile/EditProfile'));
const UploadPost = React.lazy(() => import('./Components/UploadPost/UploadPost'));
const Search = React.lazy(() => import('./Components/Search/Search'));
const Sidebar = React.lazy(() => import('./Components/Sidebar/Sidebar'));
const UserProfile = React.lazy(() => import('./Components/UserProfile/UserProfile'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track the loading state for user fetching

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      
      // Fetch the current user's profile using the /currentUser route
      const fetchCurrentUser = async () => {
        try {
          const res = await axios.get('/currentUser', {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          });

          localStorage.setItem('profileImage', res.data.profileImage || '');
          setCurrentUser(res.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } finally {
          setLoading(false);  // Update loading state
        }
      };

      fetchCurrentUser();
    } else {
      setIsAuthenticated(false);
      setLoading(false);  // Update loading state
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* Suspense for Sidebar */}
        {isAuthenticated && (
          <Suspense fallback={
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading Sidebar...</p>
            </div>
          }>
            <Sidebar setIsAuthenticated={setIsAuthenticated} />
          </Suspense>
        )}
        <div className="content">
          <Suspense fallback={
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />

              {isAuthenticated ? (
                <>
                  <Route path="/feed" element={<ProtectedRoute component={Feed} />} />
                  <Route path="/user-profile/:userId" element={<UserProfile />} />
                  <Route path="/profile" element={<ProtectedRoute component={Profile} currentUser={currentUser} />} />
                  <Route path="/profile/edit" element={<ProtectedRoute component={EditProfile} currentUser={currentUser} />} />
                  <Route path="/upload" element={<ProtectedRoute component={UploadPost} />} />
                  <Route path="/search" element={<ProtectedRoute component={Search} />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
