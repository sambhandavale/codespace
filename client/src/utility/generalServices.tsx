import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getLocalStorage, logout } from './helper';

const baseURL = `${import.meta.env.VITE_SERVER_URL}/api` || 'http://localhost:5000/api';

const Action = axios.create({
  baseURL, // Use the environment variable for the base URL
  timeout: 8000, // Set a timeout
  withCredentials: true, // Ensure credentials (e.g., cookies) are sent with requests
});

// Request Interceptor
Action.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getLocalStorage('token'); // Retrieve token from localStorage
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Response Interceptor
Action.interceptors.response.use(
  (response: AxiosResponse) => {
    return response; // Simply return the response if successful
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      logout(); // Call logout if user is unauthorized (status 401)
    }
    return Promise.reject(error); // Handle response error
  }
);

export default Action;
