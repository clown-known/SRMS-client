import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from 'js-cookie';

const axiosGetMeInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) return null;
  try {
    const response = await axios.get(`${axiosGetMeInstance.defaults.baseURL}/authentication-service/auth/refresh`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    return response.data.data.accessToken;
  } catch (error) {
    return null;
  }
};

// Custom request interceptor for axiosGetMeInstance
axiosGetMeInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and token refresh
axiosGetMeInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        Cookies.set('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosGetMeInstance(originalRequest);
      } 
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        // Optionally, redirect to login page here
        // window.location.href = '/login';
        return Promise.reject();
      
    }
    return Promise.reject(error);
  }
);

export default axiosGetMeInstance;