import { Table, Popconfirm, message, Tag, Button, Empty, Modal, Form, Input, Select, Space, Pagination, Card } from 'antd';
import { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMessageListApi, markReadApi, deleteMessageApi, sendMessageApi } from '../api/messageApi';
import { getUserNameListApi } from '../api/userApi';
import type { ColumnType } from 'antd/es/table';

interface MessageItem {
  id: number;
  title: string;
  content: string;
  type: string;
  receiverId: number;
  isRead: boolean;
  createTime: string;
}

interface UserItem {
  id: number;
  username: string;
}

const MessageList = () => {
  const [list, setList] = useState<MessageItem[]>([]);
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [form] = Form.useForm();

  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 获取消息列表（接口完全不变）
  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getMessageListApi(pageNum, pageSize);
      setList(res.data?.list || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户（接口完全不变）
  const fetchUsers = async () => {
    try {
      const res = await getUserNameListApi({});
      setUserList(res.data.data || []);
    } catch { }
  };

  // 发送消息（接口完全不变）
  const handleSend = async (values: any) => {
    await sendMessageApi(values);
    setOpenSendModal(false);
    form.resetFields();
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, [pageNum, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 列统一 TS 类型
  const columns: ColumnType<MessageItem>[] = [
    {
      title: '状态',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 80,
      render: (isRead: boolean) => (
        <Tag color={isRead ? 'blue' : 'red'}>{isRead ? '已读' : '未读'}</Tag>
      ),
    },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '接收人ID', dataIndex: 'receiverId', key: 'receiverId', width: 100 },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: any, record: MessageItem) => (
        <Space size="small">
          <Button
            type="text"
            disabled={record.isRead}
            onClick={async () => {
              await markReadApi(record.id);
              fetchList();
            }}
          >
            已读
          </Button>
          <Popconfirm
            title="确定要删除这条消息吗？"
            onConfirm={async () => {
              await deleteMessageApi(record.id);
              message.success('删除成功');
              fetchList();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="card-box" title="消息中心">
      <div className="page-container">
        {/* 统一工具栏 */}
        <div className="page-toolbar">
          <Button className="page-btn" type="primary" onClick={() => setOpenSendModal(true)}>
            发送消息
          </Button>
        </div>

        {/* 统一表格容器 */}
        <div className="page-table">
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
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

        {/* 统一弹窗样式 */}
        <Modal
          title="发送消息"
          open={openSendModal}
          onCancel={() => setOpenSendModal(false)}
          onOk={() => form.submit()}
          width={500}
          destroyOnHidden
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSend}
            initialValues={{ receiverId: 0, type: 'System' }}
          >
            <Form.Item label="标题" name="title" rules={[{ required: true }]}>
              <Input placeholder="请输入标题" autoComplete="off" />
            </Form.Item>
            <Form.Item label="内容" name="content" rules={[{ required: true }]}>
              <Input.TextArea rows={4} autoComplete="off" />
            </Form.Item>
            <Form.Item label="消息类型" name="type">
              <Select>
                <Select.Option value="System">系统通知</Select.Option>
                <Select.Option value="Notice">公告</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="接收用户" name="receiverId">
              <Select>
                <Select.Option value={0}>【全体用户】</Select.Option>
                {userList.map((u) => (
                  <Select.Option key={u.id} value={u.id}>
                    {u.username} (ID:{u.id})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Card>
  );
};

export default MessageList;