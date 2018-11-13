/* 入口启动文件 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import testStore from 'stores/testStore'
import TestTodo from 'components/TestTodo'

const Root = () =>
  <Provider testStore={testStore}>
    <TestTodo />
  </Provider>

// ================================
// 将React组件挂载到 DOM
// ================================
ReactDOM.render(<Root />, document.getElementById('product-react-wrap'))
