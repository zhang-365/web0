import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Image, message, Space, Card } from 'antd';
import { UploadOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { uploadAttachment } from '../api/attachmentApi';
import { saveProduct, updateProduct, getProductById } from '../api/productApi';
import { Editor } from '@tinymce/tinymce-react';

const CATEGORY_OPTIONS = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装鞋帽', value: 'clothing' },
  { label: '家居用品', value: 'home' },
  { label: '食品饮料', value: 'food' },
  { label: '其他', value: 'other' },
];

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

const ProductEdit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [form] = Form.useForm<ProductItem>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadDetail(Number(id));
    } else {
      form.resetFields();
      setPreviewUrl('');
      setDescription('');
    }
  }, [id]);

  const loadDetail = async (productId: number) => {
    setLoading(true);
    try {
      const res = await getProductById(productId);
      const data = res?.data;
      form.setFieldsValue(data);
      setPreviewUrl(data.imgUrl || '');
      setDescription(data.description || '');
    } catch (err) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleType', 'product');
    formData.append('moduleId', id || '0');
    try {
      const res = await uploadAttachment(formData);
      const imgUrl = res.data.fileUrl;
      form.setFieldsValue({ imgUrl });
      setPreviewUrl(imgUrl);
      message.success('上传成功');
    } catch {
      message.error('上传失败');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const submitData = { ...values, description };

      if (id) {
        await updateProduct(Number(id), submitData);
        message.success('修改成功');
      } else {
        await saveProduct(submitData);
        message.success('新增成功');
      }

      navigate('../products');
    } catch {
      message.error('保存失败');
    }
  };

  return (
    <Card
      title={
        <Space>

          {id ? '编辑产品' : '新增产品'}
          <Button icon={<LeftOutlined />} onClick={() => navigate('../products')}>
            返回
          </Button>
        </Space>
      }
      className="card-box"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: true }}
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <Form.Item
          label="产品名称"
          name="productname"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="请输入产品名称" />
        </Form.Item>

        <Form.Item label="价格" name="price">
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="库存" name="stock">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="产品分类" name="category">
          <Select options={CATEGORY_OPTIONS} placeholder="请选择分类" allowClear />
        </Form.Item>

        <Form.Item label="产品图片" name="imgUrl">
          <Space align="start" size="large">
            <Upload
              customRequest={({ file }) => handleUpload(file as File)}
              showUploadList={false}
              accept="image/*"
            >
              <Button type="primary" icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
            <div style={{ width: 120, height: 120, border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewUrl ? (
                <Image src={previewUrl} preview style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#999' }}>预览</span>
              )}
            </div>
          </Space>
        </Form.Item>

        <Form.Item label="产品详情" required>
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              value={description}
              onEditorChange={setDescription}
              licenseKey="gpl"
              init={{
                height: 320,
                menubar: false,
                branding: false,
                plugins: 'advlist autolink lists link image charmap preview anchor',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | removeformat',
              }}
            />
          </div>
        </Form.Item>


        <Form.Item label="状态" name="status" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => navigate('../productlist')}>取消</Button>
            <Button type="primary" loading={loading} onClick={handleSave}>保存</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductEdit;