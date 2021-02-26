import {request} from './request'

export function login (param) {
  return request({
    url: 'login',
    params:param,
    method: 'post'
  });
}

export function getRouter () {
  return request ({
    url: 'menus',
    method: 'get'
  });
}