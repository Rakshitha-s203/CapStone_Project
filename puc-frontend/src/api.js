import axios from "axios";

export const API = "http://localhost:5000"; // base URL

const api = axios.create({
  baseURL: API
});

// File upload
export const uploadFile = (formData) => {
  return api.post("/resources/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Auth APIs
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
