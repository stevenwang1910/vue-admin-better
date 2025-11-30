const { mock } = require('mockjs')

const List = []
const count = 50
let num = 0

// 生成活动性质选项
const activityNatureOptions = ['美食/餐厅线上活动', '地推活动', '线下主题活动', '单纯品牌曝光']
// 生成特殊资源选项
const specialResourceOptions = ['线上品牌赞助', '线下场地免费']

for (let i = 0; i < count; i++) {
  List.push(
    mock({
      id: '@id',
      activityName: '@ctitle(5, 10)',
      activityRegion: '@pick(["北京市", "上海市", "广州市", "深圳市", "杭州市"])'.replace(/"/g, ''),
      startTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      endTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      instantDelivery: '@boolean',
      activityNature: () => {
        const count = mock('@integer(1, 3)')
        const result = []
        while (result.length < count) {
          const item = mock('@pick("' + activityNatureOptions.join('","') + '")').replace(/"/g, '')
          if (!result.includes(item)) {
            result.push(item)
          }
        }
        return result
      },
      specialResource: '@pick("' + specialResourceOptions.join('","') + '")'.replace(/"/g, ''),
      activityForm: '@cparagraph(2, 5)',
      rating: '@float(0, 5, 1, 1)',
      administrativeRegion: '@pick(["北京市", "上海市", "广州市", "深圳市", "杭州市"])'.replace(/"/g, ''),
      updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    })
  )
}

module.exports = [
  {
    url: '/api/activity/list',
    type: 'get',
    response(config) {
      const { activityName = '', pageNo = 1, pageSize = 10 } = config.query
      let mockList = List.filter((item) => {
        if (activityName && item.activityName.indexOf(activityName) < 0) return false
        return true
      })
      const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        totalCount: mockList.length,
        data: pageList,
      }
    },
  },
  {
    url: '/api/activity/create',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '创建成功',
        data: null,
      }
    },
  },
  {
    url: '/api/activity/update',
    type: 'put',
    response() {
      return {
        code: 200,
        msg: '更新成功',
        data: null,
      }
    },
  },
  {
    url: '/api/activity/delete',
    type: 'delete',
    response() {
      return {
        code: 200,
        msg: '删除成功',
        data: null,
      }
    },
  },
]
