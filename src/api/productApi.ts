
import request from '../utils/request';

// 获取产品列表
export function getProductList(params: any) {
  return request.get('/product/list', { params });
}

// 新增
export function saveProduct(data: any) {
  return request.post('/product', data);
}

// 编辑
export function updateProduct(id: number, data: any) {
  return request.put(`/product/${id}`, data);
}

// 删除
export function deleteProduct(id: number) {
  return request.delete(`/product/${id}`);
}