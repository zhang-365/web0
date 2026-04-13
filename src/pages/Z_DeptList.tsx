import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, Popconfirm, message, TreeSelect, Empty, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDeptListApi, addDeptApi, updateDeptApi, deleteDeptApi, getDeptTreeApi } from '../api/deptApi';
import { hasPermission } from '../utils/permission';
import type { ColumnType } from 'antd/es/table';

interface DeptItem {
  id: number;
  deptName: string;
  parentId: number;
  sort: number;
  remark: string;
}

export default () => {
  const [form] = Form.useForm<DeptItem>();
  const [list, setList] = useState<DeptItem[]>([]);
  const [tree, setTree] = useState([]);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await getDeptListApi({
        page, pageSize: pageSize
      });
      setList(res.data.data || []);
      setTotal(res.data?.total || 0);
    }
    catch { message.error('加载失败'); }
    finally { setLoading(false); }
  };

  const loadTree = async () => {
    try { const res = await getDeptTreeApi(); setTree(res.data || []); }
    catch { }
  };

  useEffect(() => { loadList(); loadTree(); }, [page]);

  const handleSubmit = async (v: DeptItem) => {
    try {
      v.id ? await updateDeptApi(v.id, v) : await addDeptApi(v);
      message.success('成功'); setVisible(false); loadList();
    }
    catch { message.error('失败'); }
  };

  const handleDel = async (id: number) => {
    try { await deleteDeptApi(id); message.success('删除成功'); loadList(); }
    catch { message.error('删除失败'); }
  };

  const cols: ColumnType<DeptItem>[] = [
    { title: '部门名', dataIndex: 'deptName', key: 'deptName', width: 200 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_, r) => (
        <Space size="small">
          {hasPermission('deptEdit') && <Button type="text" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(r); setVisible(true); }}>编辑</Button>}
          <Popconfirm title="确定删除？" onConfirm={() => handleDel(r.id)}>
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
     <Card className="card-box" title="部门管理">
    <div className="page-container">
      <div className="page-toolbar">
        {hasPermission('deptAdd') && <Button className="page-btn" type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>新增部门</Button>}
      </div>
      <div className="page-table">
        <Table
          rowKey="id"
          loading={loading}
          columns={cols}
          dataSource={list}
          locale={{ emptyText: <Empty description="暂无消息" /> }}
          pagination={{
            current: pageNum,
            total,
            pageSize: pageSize,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page) => setPageNum(page),
          }}
          bordered
          size="middle"
        />
      </div>

      <Modal open={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()} title={form.getFieldValue('id') ? '编辑' : '新增'} destroyOnClose>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="deptName" label="部门名" rules={[{ required: true }]}><Input autoComplete="off" /></Form.Item>
          <Form.Item name="parentId" label="上级"><TreeSelect treeData={tree} fieldNames={{ label: 'deptName', value: 'id' }} /></Form.Item>
          <Form.Item name="sort" label="排序"><Input autoComplete="off" /></Form.Item>
          <Form.Item name="remark" label="备注"><Input autoComplete="off" /></Form.Item>
        </Form>
      </Modal>
    </div>
    </Card>
  );
};