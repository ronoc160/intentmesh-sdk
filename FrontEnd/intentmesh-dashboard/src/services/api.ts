import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('apiKey');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (apiKey) config.headers['x-api-key'] = apiKey;

  return config;
});

export default api;
