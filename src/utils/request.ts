import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: 'http://localhost:5278/api',
  timeout: 30000
});

// 请求拦截
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截
request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/NotFound404';
    }
    message.error(err.message);
    return Promise.reject(err);
  }
);

export default request;
