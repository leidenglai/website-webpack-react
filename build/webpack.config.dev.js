const webpack = require('webpack')
const config = require('./webpack.config.base')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const _ = require('lodash')
const { moduleList } = require('./config')
const SOURCE_MAP = true

config.output.publicPath = '/'
config.output.filename = '[name].js'
config.output.chunkFilename = '[id].js'
config.devtool = SOURCE_MAP ? 'cheap-module-eval-source-map' : false

_.forEach(config.entry, (item, key) => {
  if (_.find(moduleList, { name: key })) {
    config.entry[key] = [
      // 开启react代码的模块热替换（HMR）
      'react-hot-loader/patch',

      'webpack-hot-middleware/client?reload=true',
      // 为热替换（HMR）打包好运行代码
      // only- 意味着只有成功更新运行代码才会执行热替换（HMR）
      'webpack/hot/only-dev-server',
      item
    ]
  }
})

// 开发环境下直接内嵌 CSS 以支持热替换
// modifyVars 替换默认主题
config.module.rules.push(
  {
    test: /\.css$/,
    use: [
      'style-loader',
      `css-loader?modules&context=${__dirname}&localIdentName=[name]__[local]___[hash:base64:5]`,
      {
        loader: 'postcss-loader',
        options: { plugins: () => [require('autoprefixer')] }
      }
    ]
  },
  {
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: { plugins: () => [require('autoprefixer')] }
      },
      'less-loader'
    ]
  }
)

config.plugins.push(
  // 开启全局的模块热替换（HMR）
  new webpack.HotModuleReplacementPlugin(),

  new webpack.DefinePlugin({
    'process.env': {
      // 这是给 React 打包用的
      NODE_ENV: JSON.stringify('development')
    }
  }),

  new MiniCssExtractPlugin({ filename: '[name].css' }),
  new BrowserSyncPlugin(
    {
      host: '127.0.0.1',
      open: false,
      port: 5000,
      proxy: 'http://127.0.0.1:5000/',
      logConnections: false,
      browser: 'google chrome'
    },
    {
      reload: false
    }
  )
)

module.exports = config
