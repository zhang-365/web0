import { useState, useEffect } from 'react';
import { Tree, Button, message, Card } from 'antd';
import { Key } from 'react';
import { getRoleListApi } from '../api/roleApi';
import { getMenuTreeApi } from '../api/menuApi';
import { getRoleMenuIdsApi, saveRolePermissionsApi } from '../api/permissionApi';

const RolePermission = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [currentRoleId, setCurrentRoleId] = useState<number>(0);

  const loadRoles = async () => {
    try {
      const res = await getRoleListApi({ page: 1, pageSize: 100 });
      console.log(res.data)
      setRoles(res.data.data);
    } catch (err) {
      message.error('加载角色失败');
    }
  };

  const loadMenus = async () => {
    try {
      const res = await getMenuTreeApi();
      setMenus(res.data);
    } catch (err) {
      message.error('加载菜单失败');
    }
  };

  const loadRolePermissions = async (roleId: number) => {
    if (!roleId) return;
    try {
      const res = await getRoleMenuIdsApi(roleId);
      setCheckedKeys(res.data.map((k: number) => k as Key));
      setCurrentRoleId(roleId);
    } catch (err) {
      message.error('加载权限失败');
    }
  };

// 权限保存
const savePermissions = async () => {
  try {
    // 处理 Tree 勾选数据（兼容两种模式）
    let realCheckedKeys = [];
    
  if (Array.isArray(checkedKeys)) {
      realCheckedKeys = checkedKeys;
    } else if (checkedKeys && typeof checkedKeys === 'object') {
      realCheckedKeys = (checkedKeys as any)?.checked || [];
    }

    // 转数字
    const menuIds = realCheckedKeys.map(Number);

    // 提交到后端
    await saveRolePermissionsApi({
      roleId: currentRoleId,
      menuIds: menuIds
    });

    message.success('权限保存成功！');
  } catch (error) {
    message.error('保存失败，请检查后端接口');
  }
};

  useEffect(() => {
    loadRoles();
    loadMenus();
  }, []);

  return (
    <Card className="card-box" title="角色权限分配">
      <div className="role-btns">
        {roles.map((r: any) => (
          <Button
            key={r.id}
            type={currentRoleId === r.id ? 'primary' : 'default'}
            onClick={() => loadRolePermissions(r.id)}
          >
            {r.roleName}
          </Button>
        ))}
      </div>

      <Tree
        checkable
        checkStrictly={true}  // 关闭父子节点的联动
        treeData={menus}
        defaultCheckedKeys={['shortcut', 'dept', 'role', 'menu', 'product', 'permission']}
        checkedKeys={checkedKeys}
         onCheck={(checked) => setCheckedKeys(checked as Key[])}
        fieldNames={{
          title: 'menuName',
          key: 'id',
          children: 'children',
        }}
      />

      <div className="save-box">
        <Button type="primary" onClick={savePermissions}>
          保存权限
        </Button>
      </div>
    </Card>
  );
};

export default RolePermission;