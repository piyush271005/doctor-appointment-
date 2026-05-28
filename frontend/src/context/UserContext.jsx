import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Toast alert trigger
  const showAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 4000);
  };

  // Fetch current user data
  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      setLoading(true);
      const res = await axios.post(
        '/api/v1/user/getUserData',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        localStorage.clear();
        setUser(null);
      }
    } catch (error) {
      setLoading(false);
      localStorage.clear();
      setUser(null);
      console.log('Error getting user data:', error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        alerts,
        showAlert,
        getUser,
      }}
    >
      {children}
      
      {/* Alert Toasts Overlay */}
      <div className="alert-overlay">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-toast ${alert.type}`}>
            <span>{alert.message}</span>
          </div>
        ))}
      </div>
    </UserContext.Provider>
  );
};
