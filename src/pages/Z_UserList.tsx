import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Input, Space, Modal, Form, Popconfirm, message, Select, Tag, Empty, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUserListApi, addUserApi, updateUserApi, deleteUserApi } from '../api/userApi';
import { hasPermission } from '../utils/permission';
import { getRoleListApi } from '../api/roleApi';
import TextArea from 'antd/es/input/TextArea';
import type { ColumnType } from 'antd/es/table';


interface UserItem {
  id: number;
  username: string;
  realName: string;
  password?: string;
  roleId: number;
  roleName?: string;
  remark: string;
  status: boolean;
}

interface RoleItem {
  id: number;
  roleName: string;
}

export default () => {
  const [form] = Form.useForm<UserItem>();
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState<RoleItem[]>([]);
  const [searchParams, setSearchParams] = useState({ username: '', realName: '' });

  const loadUserList = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize, ...searchParams };
      const res = await getUserListApi(params);
      setUserList(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadRoleList = async () => {
    try {
      const res = await getRoleListApi([]);
      setRoleList(res.data.data || []);
    } catch {
      message.error('加载角色失败');
    }
  };

  useEffect(() => {
    loadUserList();
    loadRoleList();
  }, [pagination, searchParams]);

  const handleSearch = () => setPagination({ ...pagination, current: 1 });
  const handleReset = () => {
    setSearchParams({ username: '', realName: '' });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: UserItem) => {
    form.setFieldsValue({ ...record, password: undefined });
    setModalVisible(true);
  };

  const handleSubmit = async (values: UserItem) => {
    try {
      values.id ? await updateUserApi(values.id, values) : await addUserApi(values);
      message.success('操作成功');
      setModalVisible(false);
      loadUserList();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserApi(id);
      message.success('删除成功');
      loadUserList();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = useMemo<ColumnType<UserItem>[]>(() => [
    { title: '账号', dataIndex: 'username', key: 'username', width: 140, ellipsis: true },
    { title: '姓名', dataIndex: 'realName', key: 'realName', width: 120 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: s => <Tag color={s ? 'success' : 'error'}>{s ? '启用' : '禁用'}</Tag>
    },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_, r) => (
        <Space size="small">
          {hasPermission('userEdit') && <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ], []);

  return (
    <Card className="card-box" title="账号管理">
      <div className="page-container">
        <div className="page-toolbar">

          {hasPermission('userAdd') && (
            <Button className="page-btn" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
          )}
        </div>

        <div className="page-table">
          <Table<UserItem>
            rowKey="id" loading={loading}
            columns={columns} dataSource={userList}
            pagination={{
              ...pagination, total,
              showTotal: t => `共 ${t} 条`,
              onChange: (c, s) => setPagination({ current: c, pageSize: s })
            }}
            scroll={{ x: 900 }} bordered size="middle"
            locale={{ emptyText: <Empty /> }}
          />
        </div>

        <Modal
          title={form.getFieldValue('id') ? '编辑' : '新增'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          width={500} destroyOnHidden
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="id" hidden><Input /></Form.Item>
            <Form.Item name="username" label="账号" rules={[{ required: true }]}>
              <Input disabled={!!form.getFieldValue('id')} autoComplete="off" />
            </Form.Item>
            <Form.Item name="realName" label="姓名" rules={[{ required: true }]}>
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item name="password" label="密码">
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item name="roleId" label="角色" rules={[{ required: true }]}>
              <Select>{roleList.map(m => <Select.Option key={m.id} value={m.id}>{m.roleName}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select><Select.Option value={true}>启用</Select.Option><Select.Option value={false}>禁用</Select.Option></Select>
            </Form.Item>
            <Form.Item name="remark" label="备注"><TextArea rows={3} /></Form.Item>
          </Form>
        </Modal>
      </div>
    </Card>
  );
};