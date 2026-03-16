import axios from 'axios';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Auth Token & Session Refresh
axiosClient.interceptors.request.use(
  async (config) => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return config;
    }

    if (session) {
      // Check if expired (with 1 min buffer)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      
      let token = session.access_token;

      if (expiresAt < now + 60) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshData.session) {
          token = refreshData.session.access_token;
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      toast.error('Session expired, please login again');
      await supabase.auth.signOut();
      window.location.href = '/login';
    } else if (status === 429) {
      // Handle rate limits or usage limits
      const message = error.response.data?.error || 'Too many requests, please slow down';
      toast.error(message, { duration: 5000 });
    } else if (status >= 500) {
      toast.error('Server error, please try again');
    } else {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(errorMsg);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
