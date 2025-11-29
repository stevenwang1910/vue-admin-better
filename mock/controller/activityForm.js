const Mock = require('mockjs')

// 地区与城市关联数据
const regionCityMap = {
  east: [
    { label: '上海市', value: 'shanghai' },
    { label: '江苏省', value: 'jiangsu' },
    { label: '浙江省', value: 'zhejiang' },
    { label: '安徽省', value: 'anhui' },
    { label: '福建省', value: 'fujian' },
    { label: '江西省', value: 'jiangxi' },
    { label: '山东省', value: 'shandong' }
  ],
  south: [
    { label: '广东省', value: 'guangdong' },
    { label: '广西壮族自治区', value: 'guangxi' },
    { label: '海南省', value: 'hainan' },
    { label: '香港特别行政区', value: 'hongkong' },
    { label: '澳门特别行政区', value: 'macau' }
  ],
  central: [
    { label: '河南省', value: 'henan' },
    { label: '湖北省', value: 'hubei' },
    { label: '湖南省', value: 'hunan' }
  ],
  north: [
    { label: '北京市', value: 'beijing' },
    { label: '天津市', value: 'tianjin' },
    { label: '河北省', value: 'hebei' },
    { label: '山西省', value: 'shanxi' },
    { label: '内蒙古自治区', value: 'neimenggu' }
  ],
  southwest: [
    { label: '重庆市', value: 'chongqing' },
    { label: '四川省', value: 'sichuan' },
    { label: '贵州省', value: 'guizhou' },
    { label: '云南省', value: 'yunnan' },
    { label: '西藏自治区', value: 'tibet' }
  ],
  northwest: [
    { label: '陕西省', value: 'shaanxi' },
    { label: '甘肃省', value: 'gansu' },
    { label: '青海省', value: 'qinghai' },
    { label: '宁夏回族自治区', value: 'ningxia' },
    { label: '新疆维吾尔自治区', value: 'xinjiang' }
  ],
  northeast: [
    { label: '辽宁省', value: 'liaoning' },
    { label: '吉林省', value: 'jilin' },
    { label: '黑龙江省', value: 'heilongjiang' }
  ]
}

const activityData = Mock.mock({
  'list|10': [{
    'id|+1': 1,
    name: '@ctitle(5, 20)',
    region: '@pick(["east", "south", "central", "north", "southwest", "northwest", "northeast"])',
    city: function() {
      const cities = regionCityMap[this.region] || regionCityMap.east
      const randomCity = cities[Math.floor(Math.random() * cities.length)]
      return randomCity.value
    },
    startTime: '@datetime',
    endTime: '@datetime',
    delivery: '@boolean',
    'type|1-3': ['@pick(["美食/餐厅线上活动", "地推活动", "线下主题活动", "单纯品牌曝光"])'],
    resource: '@pick(["线上品牌赞助", "线下场地免费"])',
    desc: '@cparagraph(2, 5)',
    rating: '@float(0, 5, 1, 1)',
    adminDivision: '@pick([["beijing", "dongcheng"], ["shanghai", "pudong"], ["guangdong", "guangzhou", "tianhe"]])',
    createTime: '@datetime'
  }]
})

module.exports = [
  {
    url: '/activity/list',
    type: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: activityData.list
      }
    }
  },
  {
    url: '/activity/detail\\?.*',
    type: 'get',
    response: config => {
      const { id } = config.query
      const activity = activityData.list.find(item => item.id == id)
      
      return {
        code: 200,
        msg: 'success',
        data: activity || activityData.list[0]
      }
    }
  },
  {
    url: '/activity/create',
    type: 'post',
    response: () => {
      return {
        code: 200,
        msg: '活动创建成功',
        data: {
          id: Mock.mock('@id')
        }
      }
    }
  },
  {
    url: '/activity/update',
    type: 'post',
    response: () => {
      return {
        code: 200,
        msg: '活动更新成功',
        data: {}
      }
    }
  },
  {
    url: '/activity/delete',
    type: 'post',
    response: (config) => {
      const { id } = config.body
      const index = activityList.findIndex(item => item.id === id)
      
      if (index !== -1) {
        activityList.splice(index, 1)
        return {
          code: 200,
          message: '删除成功',
          data: true
        }
      } else {
        return {
          code: 404,
          message: '活动不存在',
          data: false
        }
      }
    }
  }
]

// 根据地区获取城市选项
Mock.mock(/\/activity\/getCityOptions/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const region = url.searchParams.get('region')
  
  return {
    code: 200,
    message: 'success',
    data: getCityOptionsByRegion(region)
  }
})

// 根据地区获取城市列表
const getCityOptionsByRegion = (region) => {
  return regionCityMap[region] || regionCityMap.east
}