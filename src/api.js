import axios from "axios";

// FIX: Use env variable so this works in both dev and production.
// In dev, create a .env file with: VITE_API_BASE_URL=http://127.0.0.1:8000/api/
// In production, set it to your deployed backend URL.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
});

export default API;
