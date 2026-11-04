import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request interceptor to automatically attach authorization token if present
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);
    if (parsedUser.token) {
      req.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }
  return req;
});

export default API;