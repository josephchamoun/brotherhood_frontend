import axios from "axios";

// Remove the fallback to localhost - use the production URL directly
const API_URL = import.meta.env.VITE_API_URL || "https://brotherhood-backend-1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true, // Important for CORS with cookies
});

export default api;