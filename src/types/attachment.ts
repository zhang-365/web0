// 统一附件字段（覆盖所有业务）
export interface AttachmentItem {
  id: number;
  fileName: string;       // 文件名
  fileUrl: string;         // 文件地址
  fileSize: number;        // 文件大小（字节）
  fileType?: string;       // 文件类型 image / video / audio / doc / other
  suffix?: string;         // 后缀 png / mp4 / pdf
  moduleType: string;      // 模块 product / order / common / user ...
  moduleId: string | number; // 关联数据ID
  createUserId?: number;   // 上传人ID
  createUserName?: string; // 上传人姓名
  createTime: string;      // 上传时间
  remark?: string;         // 备注
}