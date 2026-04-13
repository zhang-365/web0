import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Input, Space, Modal, Form, Popconfirm, message, Empty, Card} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoleListApi, addRoleApi, updateRoleApi, deleteRoleApi } from '../api/roleApi';
import { hasPermission } from '../utils/permission';
import type { ColumnType } from 'antd/es/table';

interface RoleItem {
  id: number;
  roleName: string;
  remark: string;
}

export default () => {
  const [form] = Form.useForm<RoleItem>();
  const [list, setList] = useState<RoleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await getRoleListApi({ page, pageSize });
      setList(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [page]);

  const handleSubmit = async (values: RoleItem) => {
    try {
      values.id ? await updateRoleApi(values.id, values) : await addRoleApi(values);
      message.success('操作成功');
      setVisible(false);
      loadList();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoleApi(id);
      message.success('删除成功');
      loadList();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = useMemo<ColumnType<RoleItem>[]>(() => [
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 200, ellipsis: true },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {hasPermission('roleEdit') && (
            <Button type="text" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setVisible(true); }}>编辑</Button>
          )}
          {hasPermission('roleDel') && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
              <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ], []);

  return (  
  <Card className="card-box" title="角色管理">
    <div className="page-container">
      <div className="page-toolbar">
        {hasPermission('roleAdd') && (
          <Button className="page-btn" type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>新增角色</Button>
        )}
      </div>

      <div className="page-table">
        <Table<RoleItem>
          rowKey="id" loading={loading} dataSource={list} columns={columns}
          pagination={{ current: page, total, showTotal: t => `共 ${t} 条`, onChange: setPage }}
          scroll={{ x: 600 }} bordered size="middle" locale={{ emptyText: <Empty /> }}
        />
      </div>

      <Modal title={form.getFieldValue('id') ? '编辑角色' : '新增角色'} open={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()} width={460} destroyOnClose>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="id" hidden><Input autoComplete="off" /></Form.Item>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}><Input autoComplete="off" /></Form.Item>
          <Form.Item name="remark" label="备注"><Input autoComplete="off" /></Form.Item>
        </Form>
      </Modal>
    </div>
    </Card>
  );
};