// frontend/src/lib/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // ⏱️ 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Attach Clerk token if available (on client side only)
api.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined" && window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting Clerk token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
    });

    // Return a more structured error for better handling
    if (error.response) {
      // Server responded with error status
      const enhancedError = {
        ...error,
        message:
          error.response.data?.message ||
          error.response.data?.error ||
          error.message,
        status: error.response.status,
        data: error.response.data,
      };
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        ...error,
        message: "Network error - please check your connection",
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
