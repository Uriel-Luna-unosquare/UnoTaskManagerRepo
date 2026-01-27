import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:5052/api",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default httpClient;
