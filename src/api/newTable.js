import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/newTable/getList',
    method: 'post',
    data: query
  })
}

export function doAdd(data) {
  return request({
    url: '/newTable/doAdd',
    method: 'post',
    data
  })
}

export function doEdit(data) {
  return request({
    url: '/newTable/doEdit',
    method: 'post',
    data
  })
}

export function doDelete(data) {
  return request({
    url: '/newTable/doDelete',
    method: 'post',
    data
  })
}
