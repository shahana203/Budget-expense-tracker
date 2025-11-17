// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL:'https://budget-expense-tracker-1.onrender.com'
});

// This function runs before every request and attaches your token (if you have one)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
