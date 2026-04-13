import request from '../utils/request';

// 获取角色列表
export const getRoleListApi = (params: any) => {
  return request.get('/Role/list', { params });
};

// 新增角色
export const addRoleApi = (data: any) => {
  return request.post('/Role', data);
};

// 修改角色
export const updateRoleApi = (id: number, data: any) => {
  return request.put(`/Role/${id}`, data);
};

// 删除角色
export const deleteRoleApi = (id: number) => {
  return request.delete(`/Role/${id}`);
};