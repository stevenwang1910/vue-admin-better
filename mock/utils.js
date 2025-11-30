const fs = require('fs')
const path = require('path')

// 在浏览器环境中定义process变量
if (typeof process === 'undefined') {
  global.process = {
    cwd: () => '/',
  }
}

const mockDir = path.join(process.cwd(), 'mock')

/**
 * 读取mock目录下的所有文件
 * @returns {Array}
 */
const handleMockArray = () => {
  const files = fs.readdirSync(mockDir)
  return files
    .filter((item) => {
      return (/\.(js)$/i).test(item) && item !== 'index.js' && item !== 'utils.js'
    })
    .map((item) => {
      return path.join(mockDir, item)
    })
}

module.exports = {
  handleMockArray,
}
