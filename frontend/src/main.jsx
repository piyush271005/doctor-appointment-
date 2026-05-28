import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import axios from 'axios';
import './index.css';

// Configure dynamic API base URL for local development and production deployments
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8080' : 'https://doctor-appointment-backend-3gfu.onrender.com');


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
