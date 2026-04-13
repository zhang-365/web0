import request from '../utils/request';
// 列表查询
export interface GetAttachmentListParams {
  pageIndex: number;
  pageSize: number;
  moduleType?: string;
  moduleId?: string | number;
  fileName?: string;
  fileType?: string;
}

// 上传
export interface UploadAttachmentParams {
  file: File;
  moduleType: string;
  moduleId: string | number;
  remark?: string;
}
// 获取附件分页列表
export function getAttachmentList(params: { 
   pageIndex: number;
  pageSize: number;
  moduleType?: string; 
  fileName?: string; 
}) {
  return request.get('/attachment/list', { params });
}

// 上传附件
export function uploadAttachment(formData: FormData) {
  return request.post('/attachment/upload', formData);
}
// 删除附件
export function deleteAttachment(id: number) {
  return request.delete(`/attachment/${id}`);
}