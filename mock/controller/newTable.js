const Mock = require('mockjs')

// 生成随机数据
const generateData = () => {
  const data = []
  for (let i = 0; i < 999; i++) {
    data.push({
      id: Mock.mock('@id'),
      uuid: Mock.mock('@uuid'),
      title: Mock.mock('@ctitle(5, 15)'),
      author: Mock.mock('@cname'),
      status: Mock.mock('@pick(["published", "draft", "deleted"])'),
      img: Mock.mock('@image(200x200, #50B347, #FFF, 图片)'),
      rating: Mock.mock('@integer(1, 5)'),
      ratingCount: Mock.mock('@integer(0, 1000)'),
      createTime: Mock.mock('@datetime'),
      updateTime: Mock.mock('@datetime'),
    })
  }
  return data
}

// 模拟数据
const tableData = generateData()

// 获取列表
const getList = (req) => {
  const { page = 1, pageSize = 20, title = '', author = '', status = '', sort = '', order = '' } = req.body
  let data = [...tableData]

  // 搜索筛选
  if (title) {
    data = data.filter((item) => item.title.includes(title))
  }
  if (author) {
    data = data.filter((item) => item.author.includes(author))
  }
  if (status) {
    data = data.filter((item) => item.status === status)
  }

  // 排序
  if (sort) {
    data.sort((a, b) => {
      if (order === 'ascending') {
        return a[sort] > b[sort] ? 1 : -1
      } else if (order === 'descending') {
        return a[sort] < b[sort] ? 1 : -1
      }
      return 0
    })
  }

  // 分页
  const total = data.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const result = data.slice(start, end)

  return {
    code: 200,
    data: result,
    total,
  }
}

// 添加
const doAdd = (req) => {
  const { title, author, status, img, rating } = req.body
  const newItem = {
    id: Mock.mock('@id'),
    uuid: Mock.mock('@uuid'),
    title,
    author,
    status,
    img: img || Mock.mock('@image(200x200, #50B347, #FFF, 图片)'),
    rating,
    ratingCount: 0,
    createTime: Mock.mock('@datetime'),
    updateTime: Mock.mock('@datetime'),
  }
  tableData.unshift(newItem)

  return {
    code: 200,
    message: '添加成功',
  }
}

// 编辑
const doEdit = (req) => {
  const { id, title, author, status, img, rating } = req.body
  const index = tableData.findIndex((item) => item.id === id)

  if (index !== -1) {
    tableData[index] = {
      ...tableData[index],
      title,
      author,
      status,
      img,
      rating,
      updateTime: Mock.mock('@datetime'),
    }

    return {
      code: 200,
      message: '编辑成功',
    }
  } else {
    return {
      code: 404,
      message: '数据不存在',
    }
  }
}

// 删除
const doDelete = (req) => {
  const { ids } = req.body
  const idList = ids.split(',')

  tableData = tableData.filter((item) => !idList.includes(item.id))

  return {
    code: 200,
    message: '删除成功',
  }
}

module.exports = [
  {
    url: '/newTable/getList',
    type: 'post',
    response: getList,
  },
  {
    url: '/newTable/doAdd',
    type: 'post',
    response: doAdd,
  },
  {
    url: '/newTable/doEdit',
    type: 'post',
    response: doEdit,
  },
  {
    url: '/newTable/doDelete',
    type: 'post',
    response: doDelete,
  },
]
