import {request} from './request'

export function getUsers(param) {
  return request({
    url: 'users',
    params: param,
    method: 'get'
  });
}

export function addUser (param) {
  return request({
    url: 'users',
    data: param,
    method: 'post'
  });
}

export function editUserState (param) {
  return request ({
    url: `users/${param.uid}/state/${param.state}`,
    method: 'put'
  });
}

export function editUserInfo (id,param) {
  return request ({
    url: `users/${id}`,
    data: param,
    method: 'put'
  });
}

export function queryUserInfoById (id) {
  return request({
    url: `users/${id}`,
    method: 'get'
  });
}

export function deleteUser (id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  });
}

export function allotRoleToUser (uid, rid) {
  return request ({
    url: `users/${uid}/role`,
    data: {'rid':rid},
    method: 'put'
  });
}