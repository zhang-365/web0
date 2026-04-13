
import request from '../utils/request';
export const getUserNameListApi = (params: any) => {
  return request.get('/User/userlist', { params });
};
export const getUserListApi = (params: any) => {
  return request.get('/User/list', { params });
};

export const addUserApi = (data: any) => {
  return request.post('/User', data);
};

export const updateUserApi = (id: number, data: any) => {
  return request.put(`/User/${id}`, data);
};

export const deleteUserApi = (id: number) => {
  return request.delete(`/User/${id}`);
};

