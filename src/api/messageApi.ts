import request from '../utils/request';

// 获取未读数
export const getUnreadCountApi = () => request.get('/message/unread-count');
// 获取消息列表
export const getMessageListApi = (pageIndex: number, pageSize: number) =>
  request.get('/message/list', { params: { pageIndex, pageSize } });
// 标记已读
export const markReadApi = (id: number) => request.post(`/message/read/${id}`);
// 全部已读
export const markAllReadApi = () => request.post('/message/read-all');
// 删除消息
export const deleteMessageApi = (id: number) => request.post(`/message/delete/${id}`);
// 发送消息（管理员）
export const sendMessageApi = (data: any) => request.post('/message/send', data);


