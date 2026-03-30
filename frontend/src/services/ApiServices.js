import axios from 'axios';

// Configure Axios Instance
const API_URL = 'https://proxima-5luj.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/logout'
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        console.warn('Refresh token failed. Please log in again.');
        // Optionally dispatch a local event to trigger logout here, but we will let authSlice catch the repeated failure
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
