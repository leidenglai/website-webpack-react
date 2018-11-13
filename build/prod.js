const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.config.prod')

webpack(config, (err, stats) => {
  // show build info to console
  console.log(stats.toString({ chunks: false, color: true }))

  // save build info to file
  fs.writeFile(path.join(config.output.path, '__build_info__'), stats.toString({ color: false }), err => {
    err && console.log(err)
  })
})
