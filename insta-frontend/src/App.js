import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import axios from './axios';

// Lazy load components
const Login = React.lazy(() => import('./Components/Login/Login'));
const Register = React.lazy(() => import('./Components/Register/Register'));
const Feed = React.lazy(() => import('./Components/Feed/Feed'));
const Profile = React.lazy(() => import('./Components/Profile/Profile'));
const EditProfile = React.lazy(() => import('./Components/EditProfile/EditProfile'));
const UploadPost = React.lazy(() => import('./Components/UploadPost/UploadPost'));
const Search = React.lazy(() => import('./Components/Search/Search'));
const UserProfile = React.lazy(() => import('./Components/UserProfile/UserProfile'));
const ProtectedRoute = React.lazy(() => import('./ProtectedRoute'));

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
        <p>Loading, please wait...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
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
