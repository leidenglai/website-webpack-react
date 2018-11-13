let webpack = require('webpack')
let express = require('express')
let webpackDevMiddleware = require('webpack-dev-middleware')
let webpackHotMiddleware = require('webpack-hot-middleware')
let config = require('./webpack.config.dev')

let app = express()

app.use('/static', express.static('static'))

let compiler = webpack(config)

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
)

app.use(webpackHotMiddleware(compiler))

app.listen(5000, '127.0.0.1', err => {
  err && console.log(err)
})
