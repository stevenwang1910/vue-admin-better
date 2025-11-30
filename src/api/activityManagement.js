import request from '@/utils/request'

/**
 * 获取活动列表
 * @param {Object} queryParams - 查询参数
 * @returns {Promise}
 */
export function getList(queryParams) {
  return request({
    url: '/api/activity/list',
    method: 'get',
    params: queryParams,
  })
}

/**
 * 创建或编辑活动
 * @param {Object} data - 活动数据
 * @returns {Promise}
 */
export function doEdit(data) {
  return request({
    url: data.id ? '/api/activity/update' : '/api/activity/create',
    method: data.id ? 'put' : 'post',
    data,
  })
}

/**
 * 删除活动
 * @param {Object} params - 参数
 * @param {string} params.ids - 活动ID，多个用逗号分隔
 * @returns {Promise}
 */
export function doDelete(params) {
  return request({
    url: '/api/activity/delete',
    method: 'delete',
    params,
  })
}
