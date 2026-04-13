import request from '../utils/request';

// 获取角色权限
export const getRoleMenuIdsApi = (roleId: number) => {
  return request.get(`/RolePermission/getRoleMenuIds/${roleId}`);
};

// 保存权限
export const saveRolePermissionsApi = (data: any) => {
  return request.post('/RolePermission/savePermissions', data);
};