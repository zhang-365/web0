// 获取当前用户角色
export const getCurrentUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.roleId || user.role?.id || 0;
};

// 按钮权限判断（超级管理员：roleId === 1）
export const hasPermission = (key: string) => {
  const roleId = getCurrentUserRole();

  // 超级管理员拥有所有权限
  if (roleId === 1) return true;

  // 普通管理员/普通角色只开放部分权限
  const permissions: Record<string, number[]> = {
    userAdd: [1,2],
    userEdit: [1,2],
    userDel: [1,2],

    deptAdd:[1,2],
    deptEdit: [1,2],
    deptDel: [1,2],

    roleAdd: [1,2],
    roleEdit: [1,2],
    roleDel: [1,2],

    menuAdd: [1,2],
    menuEdit: [1,2],
    menuDel: [1,2],

    productAdd: [1, 2],
    productEdit: [1, 2],
    productDel: [1,2],
  };

  return permissions[key]?.includes(roleId) ?? false;
};