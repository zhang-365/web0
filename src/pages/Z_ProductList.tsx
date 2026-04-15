import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Image,
  Select,
  Empty,
  Input,
  Card
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getProductList,
  deleteProduct,
} from '../api/productApi';

export interface ProductItem {
  id?: number;
  productname?: string;
  price?: number;
  stock?: number;
  category?: string;
  imgUrl?: string;
  status?: boolean;
  description?: string;
}

const ProductList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [productName, setName] = useState('');
  const [category, setCategory] = useState('');

  const categoryOptions = [
    { label: '电子产品', value: 'electronics' },
    { label: '服装鞋帽', value: 'clothing' },
    { label: '家居用品', value: 'home' },
    { label: '食品饮料', value: 'food' },
    { label: '其他', value: 'other' },
  ];

  const getList = async () => {
    setLoading(true);
    try {
      const res = await getProductList({
        pageIndex: pageNum,
        pageSize,
        productName,
        category,
      });
      setList(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      message.success('删除成功');
      getList();
    } catch {
      message.error('删除失败');
    }
  };

  // 跳转到新增页面
  const handleAdd = () => {
    navigate('../productedit');
  };

  // 跳转到编辑页面（带ID）
  const handleEdit = (record: ProductItem) => {
    navigate(`../productedit?id=${record.id}`);
  };

  useEffect(() => {
    getList();
  }, [pageNum, productName, category]);

  const columns = [
    {
      title: '产品图片',
      dataIndex: 'imgUrl',
      render: (url: string) =>
        url ? (
          <Image width={50} height={50} src={url} preview style={{ objectFit: 'cover' }} />
        ) : (
          <span>无图</span>
        ),
    },
    {
      title: '产品名称',
      dataIndex: 'productname',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (c: string) => {
        const item = categoryOptions.find(x => x.value === c);
        return item ? item.label : c;
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s: boolean) => (s ? '启用' : '禁用'),
    },
    {
      title: '操作',
      render: (r: ProductItem) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(r.id!)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="card-box" title="产品管理">
      <div className="page-container">
        <div className="page-toolbar">
          <Input
            placeholder="产品名称"
            value={productName}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="分类筛选"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            allowClear
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增产品
          </Button>
        </div>
        <div className="page-table">
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={list}
            locale={{ emptyText: <Empty description="暂无数据" /> }}
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
      </div>
    </Card>
  );
};

export default ProductList;