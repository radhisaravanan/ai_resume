import axios from "axios";

// Create a centralized Axios instance targeting your backend
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Maps perfectly with server.js routing paths
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token into authorization headers for secure routes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
