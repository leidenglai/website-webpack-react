const layout = require('layout/main/html')
const content = require('./content.html')

module.exports = layout
  .init({
    title: 'xxx',
    description: 'xxx'
  })
  .run(content())
