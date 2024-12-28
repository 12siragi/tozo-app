import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create an axios instance with the hardcoded base URL
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Directly using the hardcoded URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include access token
axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const decodedToken = jwtDecode<{ exp: number }>(accessToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect using react-router instead of full reload
      window.location.href = '/login'; // You can use `history.push('/login')` with react-router-dom
      return Promise.reject('Token expired');
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 and refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const refreshResponse = await axios.post(
          'http://127.0.0.1:8000/api/auth/token/refresh/', // Hardcoded URL for token refresh
          { refresh: refreshToken }
        );

        const { access } = refreshResponse.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Handle failed token refresh
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
