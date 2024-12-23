import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = 'http://127.0.0.1:8000/api'; // Backend URL

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to include access tokens in request headers
axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const decodedToken = jwtDecode<{ exp: number }>(accessToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      // If token is expired, clear tokens from localStorage and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // Redirect to login page
      return Promise.reject('Token expired');
    }
    // Include the access token in the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 errors and attempt token refresh
axiosClient.interceptors.response.use(
  (response) => response, // If response is successful, return it
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401 (unauthorized) and we haven't retried yet, try refreshing the token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const refreshResponse = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = refreshResponse.data;
        // Store new access token in localStorage
        localStorage.setItem('access_token', access);

        // Update Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request with the new token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, clear tokens and redirect to login page
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 error or the retry logic didn't work, reject the error
    return Promise.reject(error);
  }
);

export default axiosClient;
