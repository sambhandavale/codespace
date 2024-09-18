import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getLocalStorage, logout } from './helper';

const Action = axios.create({
  baseURL: 'http://localhost:5000',
});

Action.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getLocalStorage('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Action.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default Action;
