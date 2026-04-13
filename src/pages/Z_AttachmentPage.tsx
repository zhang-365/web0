import { useState, useEffect, useMemo } from 'react';
import {
  Table, Button, Upload, message, Popconfirm, Space, Image,
  Select, Input, Empty,Card
} from 'antd';
import {
  UploadOutlined, DownloadOutlined, DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { getAttachmentList, deleteAttachment, uploadAttachment } from '../api/attachmentApi';
import type { ColumnType } from 'antd/es/table';
import type { AttachmentItem } from '../types/attachment';

const { Option } = Select;

const AttachmentPage = () => {
  const [list, setList] = useState<AttachmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
   const [pageSize, setpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [moduleType, setModuleType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // 获取列表
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getAttachmentList({
        pageIndex: pageNum,
        pageSize: pageSize,
        moduleType,
        fileName,
      });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 上传
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleType', moduleType || 'common');
    await uploadAttachment(formData);
    message.success('上传成功');
    fetchList();
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await deleteAttachment(id);
      message.success('删除成功');
      fetchList();
    } catch {
      message.error('删除失败');
    }
  };

  // 搜索
  const handleSearch = () => {
    setPageNum(1);
    fetchList();
  };

  // 重置
  const handleReset = () => {
    setModuleType('');
    setFileName('');
    setPageNum(1);
  };

  useEffect(() => {
    fetchList();
  }, [pageNum, moduleType, fileName]);

  // 列统一类型
  const columns = useMemo<ColumnType<AttachmentItem>[]>(() => [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true,
      width: 220,
    },
    {
      title: '预览',
      key: 'preview',
      width: 80,
      render: (r) => (
        <Image
          width={40}
          src={r.fileUrl}
          fallback="https://via.placeholder.com/40"
        />
      ),
    },
    {
      title: '大小',
      key: 'size',
      width: 100,
      render: (r) => `${(r.fileSize / 1024).toFixed(2)}KB`,
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 120,
    },
    {
      title: '后缀',
      dataIndex: 'suffix',
      key: 'suffix',
      width: 100,
    },
    {
      title: '所属模块',
      dataIndex: 'moduleType',
      key: 'moduleType',
      width: 120,
    },
    {
      title: '关联ID',
      dataIndex: 'moduleId',
      key: 'moduleId',
      width: 100,
    },
    {
      title: '上传人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 120,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (r) => (
        <Space size="small">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => window.open(r.fileUrl)}
          >
            下载
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(r.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], []);

  return (
     <Card className="card-box" title="附件管理">
     <div className="page-container">
      <div className="page-toolbar">
        <Select
          placeholder="模块筛选"
          style={{ width: 160 }}
          value={moduleType}
          onChange={setModuleType}
        >
          <Option value="">全部</Option>
          <Option value="common">公共</Option>
          <Option value="product">产品</Option>
          <Option value="order">订单</Option>
          <Option value="user">用户</Option>
          <Option value="goods">商品</Option>
        </Select>

        <Input
          placeholder="文件名搜索"
          style={{ width: 200 }}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          autoComplete="off"
        />

        <Button
          icon={<SearchOutlined />}
          type="primary"
          onClick={handleSearch}
        >
          搜索
        </Button>
        <Button onClick={handleReset}>重置</Button>

        <Upload
          customRequest={({ file }) => handleUpload(file as File)}
          showUploadList={false}
        >
          <Button type="primary" icon={<UploadOutlined />}>
            批量上传
          </Button>
        </Upload>
      </div>

      {/* 统一表格 */}
      <Table<AttachmentItem>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={{
          current: pageNum,
          total,
          pageSize: pageSize,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page) => setPageNum(page),
        }}
        scroll={{ x: 1300 }}
        bordered
        size="middle"
        locale={{ emptyText: <Empty description="暂无附件数据" /> }}
      />
    </div>
    </Card>
  );
};

export default AttachmentPage;