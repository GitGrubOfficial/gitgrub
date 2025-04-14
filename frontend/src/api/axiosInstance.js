import axios from 'axios';

// Create a pre-configured axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Change if you're deploying elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh access token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh if we haven't already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          'http://localhost:8000/api/auth/jwt/refresh/',
          {
            refresh: localStorage.getItem('refreshToken'),
          }
        );

        const newAccessToken = refreshRes.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // force logout
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
