const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SOURCE_MAP = false

const { rootPath, version } = require('./config')

const commonPath = {
  rootPath,
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
}

config.output.filename = `[name].${version}.js`
config.output.chunkFilename = `[id].${version}.js`

config.devtool = SOURCE_MAP ? 'hidden-source-map' : false

// 生产环境下分离出 CSS 文件
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
    loader: [
      'style-loader',
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: { plugins: () => [require('autoprefixer')] }
      },
      'less-loader'
    ]
  }
)

config.optimization.minimizer = [new UglifyJsPlugin()]

config.plugins.push(
  // 启用作用域提升
  // 作用域提升会移除模块外的函数包装,体积改进; 更显著的改进是 JavaScript 在浏览器中加载的速度
  new webpack.optimize.ModuleConcatenationPlugin(),

  new CleanWebpackPlugin('dist', {
    root: commonPath.rootPath,
    verbose: false
  }),
  new CopyWebpackPlugin([
    // 复制高度静态资源
    {
      context: commonPath.staticDir,
      from: '**/*',
      ignore: ['*.md']
    }
  ]),
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 30000
  }),
  new webpack.DefinePlugin({
    'process.env': {
      // 这是给 React 打包用的
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new MiniCssExtractPlugin({ filename: '[name].[contenthash:6].css' })
)

module.exports = config
