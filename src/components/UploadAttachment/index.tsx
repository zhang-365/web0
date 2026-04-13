import { Upload, Button, message, Image, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadAttachment } from '../../api/attachmentApi';
import { useState } from 'react';

// 通用附件组件 Props（支持所有模块）
export interface UploadAttachmentProps {
  value?: string; // 单个文件 URL
  onChange?: (url: string) => void;
  moduleType?: string; // 模块：product / order / common / user ...
  moduleId?: string | number; // 数据ID
  maxCount?: number;
  disabled?: boolean;
}

const UploadAttachment = ({
  value = '',
  onChange,
  moduleType = 'common',
  moduleId = 0,
  disabled = false,
}: UploadAttachmentProps) => {
  const [previewUrl, setPreviewUrl] = useState(value);

  // 统一上传逻辑
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleType', moduleType);
    formData.append('moduleId', String(moduleId));

    try {
      const res = await uploadAttachment(formData);
      const fileUrl = res.data.fileUrl;
      setPreviewUrl(fileUrl);
      onChange?.(fileUrl);
      message.success('上传成功');
    } catch (err) {
      message.error('上传失败');
      console.error(err);
    }
  };

  return (
    <Space align="start">
      <Upload
        customRequest={({ file }) => handleUpload(file as File)}
        showUploadList={false}
        disabled={disabled}
        accept="*"
      >
        <Button icon={<UploadOutlined />} disabled={disabled}>
          上传附件
        </Button>
      </Upload>

      {previewUrl && (
        <Image
          width={80}
          src={previewUrl}
          fallback="https://via.placeholder.com/80"
          style={{ borderRadius: 4 }}
        />
      )}
    </Space>
  );
};

export default UploadAttachment;