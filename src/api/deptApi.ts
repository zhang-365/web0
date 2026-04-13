import request from '../utils/request';

// 获取部门分页列表
export const getDeptListApi = (params: any) => {
  return request.get('/Department/list', { params });
};

// 获取部门树形
export const getDeptTreeApi = () => {
  return request.get('/Department/tree');
};

// 新增部门
export const addDeptApi = (data: any) => {
  return request.post('/Department', data);
};

// 修改部门
export const updateDeptApi = (id: number, data: any) => {
  return request.put(`/Department/${id}`, data);
};

// 删除部门
export const deleteDeptApi = (id: number) => {
  return request.delete(`/Department/${id}`);
};

