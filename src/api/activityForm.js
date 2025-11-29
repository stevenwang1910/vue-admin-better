import request from '@/utils/request'

export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

export function getActivityDetail(id) {
  return request({
    url: `/activity/detail`,
    method: 'get',
    params: { id }
  })
}

export function createActivity(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data
  })
}

export function updateActivity(data) {
  return request({
    url: '/activity/update',
    method: 'post',
    data
  })
}

export function deleteActivity(id) {
  return request({
    url: `/activity/delete`,
    method: 'post',
    data: { id }
  })
}

export function getRegionOptions() {
  return Promise.resolve([
    { label: '华东地区', value: 'east' },
    { label: '华南地区', value: 'south' },
    { label: '华中地区', value: 'central' },
    { label: '华北地区', value: 'north' },
    { label: '西南地区', value: 'southwest' },
    { label: '西北地区', value: 'northwest' },
    { label: '东北地区', value: 'northeast' }
  ])
}

export function getCityOptions(region) {
  const cityMap = {
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
  
  return Promise.resolve(cityMap[region] || [])
}

export function getAdminDivisionOptions() {
  return Promise.resolve([
    {
      value: 'beijing',
      label: '北京市',
      children: [
        { value: 'dongcheng', label: '东城区' },
        { value: 'xicheng', label: '西城区' },
        { value: 'chaoyang', label: '朝阳区' },
        { value: 'haidian', label: '海淀区' }
      ]
    },
    {
      value: 'shanghai',
      label: '上海市',
      children: [
        { value: 'huangpu', label: '黄浦区' },
        { value: 'xuhui', label: '徐汇区' },
        { value: 'changning', label: '长宁区' },
        { value: 'pudong', label: '浦东新区' }
      ]
    },
    {
      value: 'guangdong',
      label: '广东省',
      children: [
        {
          value: 'guangzhou',
          label: '广州市',
          children: [
            { value: 'tianhe', label: '天河区' },
            { value: 'yuexiu', label: '越秀区' },
            { value: 'liwan', label: '荔湾区' }
          ]
        },
        {
          value: 'shenzhen',
          label: '深圳市',
          children: [
            { value: 'futian', label: '福田区' },
            { value: 'luohu', label: '罗湖区' },
            { value: 'nanshan', label: '南山区' }
          ]
        }
      ]
    },
    {
      value: 'zhejiang',
      label: '浙江省',
      children: [
        {
          value: 'hangzhou',
          label: '杭州市',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'shangcheng', label: '上城区' },
            { value: 'xiacheng', label: '下城区' }
          ]
        },
        {
          value: 'ningbo',
          label: '宁波市',
          children: [
            { value: 'jiangdong', label: '江东区' },
            { value: 'jiangbei', label: '江北区' },
            { value: 'haishu', label: '海曙区' }
          ]
        }
      ]
    }
  ])
}