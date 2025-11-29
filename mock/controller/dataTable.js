const Mock = require('mockjs')

const data = Mock.mock({
  'items|100': [
    {
      id: '@increment',
      title: '@ctitle(5, 20)',
      'image|1-5': '@image("200x200", "@color", "@word")',
      author: '@cname',
      'rating|1-5': 1,
      'ratingCount|10-1000': 1,
      'status|1': ['published', 'draft', 'deleted'],
      createTime: '@datetime',
      pageViews: '@integer(300, 5000)',
    },
  ],
})

module.exports = [
  {
    url: '/dataTable/getList',
    type: 'post',
    response: (config) => {
      const { pageNo = 1, pageSize = 20, title = '', author = '', rating = '', status = '', sortProp = '', sortOrder = '' } = config.body
      
      let mockList = data.items.filter((item) => {
        if (title && !item.title.includes(title)) return false
        if (author && !item.author.includes(author)) return false
        if (rating && item.rating !== parseInt(rating)) return false
        if (status && item.status !== status) return false
        return true
      })

      // 排序
      if (sortProp && sortOrder) {
        mockList.sort((a, b) => {
          const propA = a[sortProp]
          const propB = b[sortProp]
          if (sortOrder === 'ascending') {
            return propA > propB ? 1 : -1
          } else {
            return propA < propB ? 1 : -1
          }
        })
      }

      const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

      return {
        code: 200,
        msg: 'success',
        data: pageList,
        totalCount: mockList.length,
      }
    },
  },
  {
    url: '/dataTable/doEdit',
    type: 'post',
    response: () => ({
      code: 200,
      msg: '编辑成功',
    }),
  },
  {
    url: '/dataTable/doDelete',
    type: 'post',
    response: () => ({
      code: 200,
      msg: '删除成功',
    }),
  },
  {
    url: '/dataTable/getDetail/*',
    type: 'get',
    response: (config) => {
      const id = config.url.split('/').pop()
      const item = data.items.find(item => item.id === parseInt(id))
      
      if (item) {
        return {
          code: 200,
          msg: 'success',
          data: item,
        }
      } else {
        return {
          code: 404,
          msg: '数据不存在',
        }
      }
    },
  },
]