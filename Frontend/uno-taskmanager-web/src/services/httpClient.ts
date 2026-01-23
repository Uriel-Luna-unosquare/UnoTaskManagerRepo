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

export default httpClient;
