const path = require('path')
const rootPath = path.resolve(__dirname, '..') // 项目根目录
const src = path.join(rootPath, 'src') // 开发源码目录
const env = process.env.NODE_ENV.trim() // 当前环境
const version = process.argv[2] // 版本号 用于build

// 模块列表
const moduleList = [
  {
    // 主页
    module: 'product',
    name: 'test'
  }
]

// 静态资源目录
const CDN_PATH = '/static/'

module.exports = {
  CDN_PATH,
  moduleList,
  rootPath,
  src,
  env,
  version
}
