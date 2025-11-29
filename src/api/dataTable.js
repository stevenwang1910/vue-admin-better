import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/dataTable/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/dataTable/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/dataTable/doDelete',
    method: 'post',
    data,
  })
}

export function getDetail(id) {
  return request({
    url: `/dataTable/getDetail/${id}`,
    method: 'get',
  })
}