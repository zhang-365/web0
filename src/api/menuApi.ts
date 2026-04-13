import request from '../utils/request';


// 获取当前用户菜单
export const getCurrentMenusApi = () => {
  return request.get('/UserMenu/getCurrentUserMenus');
};

// 获取全部菜单树形（新增，解决你的报错！）
export const getMenuTreeApi = () => {
  return request.get('/Menu/tree');
};

// 新增菜单
export const addMenuApi = (data: any) => {
  return request.post('/Menu', data);
};

// 修改菜单
export const updateMenuApi = (id: number, data: any) => {
  return request.put(`/Menu/${id}`, data);
};

// 删除菜单
export const deleteMenuApi = (id: number) => {
  return request.delete(`/Menu/${id}`);
};