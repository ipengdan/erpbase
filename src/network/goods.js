import {request} from './request'

export function getCategoryList(param) {
  return request({
    url: 'categories',
    params: param,
    method: 'get'
  });
}

export function addCategory(param) {
  return request({
    url: 'categories',
    data: param,
    method: 'post'
  });
}

export function editCategory(param) {
  return request({
    url: `categories/${param.cat_id}`,
    data: {'cat_name':param.cat_name},
    method: 'put'
  });
}

export function deleteCategory(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  });
}

export function getParamsById(id,type) {
  return request({
    url: `categories/${id}/attributes`,
    params: {sel:type},
    method: 'get'
  });
}

export function addParam(id, attrName,type) {
  return request({
    url: `categories/${id}/attributes`,
    data: {attr_name:attrName,attr_sel:type},
    method: 'post'
  });
}

export function deleteParam(cat_id,attr_id) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    method: 'delete'
  });
}

export function editParam(cat_id,attr_id, attrName, type) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    data: {attr_name:attrName,attr_sel:type},
    method: 'put'
  });
}

export function getParamById(cat_id,attr_id, type) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    data: {attr_sel:type},
    method: 'get'
  });
}

export function deleteValueFromParam(cat_id,attr_id, attrName, type, val) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    data: {attr_name:attrName,attr_sel:type,attr_vals:val},
    method: 'put'
  });
}

export function getGoodsList(param){
  return request({
    url: 'goods',
    params: param,
    method: 'get'
  });
}

export function deleteGoods(id){
  return request({
    url: `goods/${id}`,
    method: 'delete'
  });
}

export function addGoods(param){
  return request({
    url: 'goods',
    data: param,
    method: 'post'
  });
}
