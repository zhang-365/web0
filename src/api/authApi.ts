import request from '../utils/request';

// 登录接口
export const loginApi = (data: { username: string; password: string }) => {
  return request.post('/Auth/login', data);
};