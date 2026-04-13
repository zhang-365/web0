import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  Image,
  message,
  Space,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadAttachment } from '../api/attachmentApi';
import { saveProduct, updateProduct } from '../api/productApi';
import { useEffect, useState } from 'react';

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
}

interface ProductFormModalProps {
  visible: boolean;
  initialValues?: ProductItem;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<ProductItem>();
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setPreviewUrl(initialValues.imgUrl || '');
    }
  }, [visible, initialValues]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleType', 'product');
    formData.append('moduleId', initialValues?.id?.toString() || '0');
    try {
      const res = await uploadAttachment(formData);
      const imgUrl = res.data.fileUrl;
      form.setFieldsValue({ imgUrl });
      setPreviewUrl(imgUrl);
      message.success('上传成功');
    } catch (error) {
      console.error('上传失败：', error);
      message.error('上传失败');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (initialValues?.id) {
        await updateProduct(initialValues.id, values);
        message.success('修改成功');
      } else {
        await saveProduct(values);
        message.success('新增成功');
      }
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('保存失败：', error);
      message.error('保存失败');
    }
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑产品' : '新增产品'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={650}
      destroyOnHidden
    >
      {visible && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
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
                <Button type="primary" icon={<UploadOutlined />}>上传附件</Button>
              </Upload>
              <div className="imgUrldiv">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    preview
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className='yulan'>预览区域</span>
                )}
              </div>
            </Space>
          </Form.Item>

          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ProductFormModal;