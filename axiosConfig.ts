import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useCookie } from '@/hook/useCookie';
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Base URL of the API
  timeout: 10000, // Timeout for requests (optional)
  headers: {
    'Content-Type': 'application/json',
  },
});
const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if(refreshToken) return null;
  const response = await axios.get(`http://localhost:3000/authentication-service/auth/refresh`, {
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  });
  return response.data.data.accessToken; // Return the new access token
};

// Request interceptor to add headers (e.g., authentication tokens)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    console.log(token)
    // const token = localStorage.getItem('token'); // Example: Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Response interceptor to handle errors and responses globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response; // Simply return the response if successful
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refreshToken');
      
      if (!refreshToken) {
        // If no refresh token, reject the request
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          Cookies.set('token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } 
          // If refreshAccessToken returns null or undefined
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          return Promise.reject(error);
        
      } catch (refreshError) {
        // If refreshAccessToken throws an error (e.g., 401 from refresh endpoint)
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;