const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { src, moduleList, env } = require('./config')

let htmlWebpackList = []

function tplOptionConstructor(moduleItem) {
  // 模块名
  const moduleName = moduleItem.module

  // 控制器文件名；controller 用于js复用
  const controller = module.controller || moduleItem.name

  return {
    filename: `${env === 'development' ? '' : '../'}${controller}.html`,
    template: path.resolve(src, `./pages/${moduleName}/${controller}/html.js`),
    chunks: ['manifest', controller],
    chunksSortMode: 'dependency',
    minify: false
  }
}

// 循环构建模块配置
moduleList.forEach(moduleItem => {
  const webpackModule = new HtmlWebpackPlugin(tplOptionConstructor(moduleItem))

  htmlWebpackList.push(webpackModule)
})

module.exports = htmlWebpackList
