// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../Utils/AxiosInstance'; // Make sure to use your configured Axios instance
import axiosInstance from '../Utils/AxiosInstance';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = auth status

  const checkAuth = async () => {
    try {
      // Check access token validity
      const res = await axiosInstance.get('http://localhost:8000/api/users/verify_token', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (res.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Try refreshing the access token
      try {
        const refreshRes = await axiosInstance.post('http://localhost:8000/api/users/refresh/', null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
          },
        });

        if (refreshRes.status === 200) {
          localStorage.setItem('access_token', refreshRes.data.access);
          setIsAuthenticated(true);
        }
      } catch (refreshErr) {
        // Clear tokens and mark unauthenticated
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (event) => {
      if (event.key === 'logout-event' || (event.key === 'access_token' && !event.newValue)) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
