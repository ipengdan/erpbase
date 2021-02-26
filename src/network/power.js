import {request} from './request'

export function getRights (type) {
  return request({
    url: `rights/${type}`,
    method: 'get'
  });
}

export function getRoleList() {
  return request({
    url: 'roles',
    method: 'get'
  });
}

export function addRole(param) {
  return request({
    url: 'roles',
    data: param,
    method: 'post'
  });
}

export function getRoleById(id) {
  return request({
    url: `roles/${id}`,
    method: 'get'
  });
}

export function editRole(param) {
  return request({
    url: `roles/${param.id}`,
    data: {'roleName':param.roleName,'roleDes': param.roleDes},
    method: 'put'
  });
}

export function deleteRole(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  });
}

export function deleteRightByRoleId (roleId,rightId) {
  return request ({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  });
}

export function getRoleRightByType (type) {
  return request({
    url: `rights/${type}`,
    method: 'get'
  });
}

export function allotRightByRoleId (id,param) {
  return request({
    url: `roles/${id}/rights`,
    data: param,
    method: 'post'
  });
}