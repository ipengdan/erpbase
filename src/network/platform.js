import {request} from './request'

export function getPlatforms(){
  return request({
    url: '/platforms',
    method: 'get'
  });
}