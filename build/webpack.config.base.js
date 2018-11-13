const path = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const rucksack = require('rucksack-css')
const autoprefixer = require('autoprefixer')
const htmlWebpackList = require('./webpack.config.tpl')
const { rootPath, src, env, CDN_PATH, moduleList } = require('./config')

const commonPath = {
  dist: path.join(rootPath, 'dist/static') // build 后输出目录
}

// 公共文件
let entry = {}

// 循环出每一个模块的js 默认使用模块名作为js名字
moduleList.forEach(moduleItem => {
  // 模块名
  const moduleName = moduleItem.module
  // 控制器文件名
  const controller = moduleItem.name

  entry[controller] = path.join(src, `containers/${moduleName}/${controller}`)
})

// webpack主要公共配置
module.exports = {
  mode: env,
  entry,
  output: {
    path: commonPath.dist,
    publicPath: CDN_PATH
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    alias: {
      // ================================
      // 自定义路径别名
      // ================================
      src,
      assets: path.join(src, 'assets'),
      containers: path.join(src, 'containers'),
      utils: path.join(src, 'utils'),
      components: path.join(src, 'components'),
      stores: path.join(src, 'stores'),
      tpl: path.join(src, 'tpl'),
      layout: path.join(src, 'tpl/layout'),
      static: path.join(rootPath, 'static')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'underscore-template-loader',
            options: {
              attributes: ['img:src'],
              engine: 'lodash',
              prependFilenameComment: __dirname
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 5 * 1024, // 5KB 以下使用 base64
          name: 'img/[name]-[hash:6].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'url-loader?limit=10240&name=fonts/[name]-[hash:6].[ext]'
      }
    ]
  },
  plugins: [
    // html模板生成配置
    ...htmlWebpackList,

    new ProgressBarPlugin(), // 进度条
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          rucksack(),
          autoprefixer({
            browsers: ['last 2 versions', '> 5%', 'not ie <= 9']
          })
        ]
      }
    }),

    new webpack.DefinePlugin({
      // ================================
      // 配置开发全局常量
      // ================================
      __DEV__: env === 'development',
      __PROD__: env === 'production'
    })
  ]
}
