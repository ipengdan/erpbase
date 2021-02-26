import {request} from './request'

export function getOrderList(param){
  return request({
    url: 'orders',
    params: param,
    method: 'get'
  });
}