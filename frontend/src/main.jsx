import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import axios from 'axios';
import './index.css';

// Configure dynamic API base URL for local development and production deployments
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
