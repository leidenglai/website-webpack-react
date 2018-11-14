# Webpack 搭建多页面应用 Create in 2018-11-13

# 开始

初始化 安装依赖

```sh
npm install
```

调试模式

```sh
npm start
```

构建

```sh
npm run build -- 20171124(本次项目版本)
```

# 架构介绍

为满足如下的开发需求：

1. 后端直出页面，控制路由，前端出 html 模板
2. 前端模块化，能用 ES6 乃至 ES7 语法
3. 复杂交互逻辑避免前后端过多纠缠，尽量后端给出初始数据后，全由前端处理
4. 无复杂 SEO 需求
5. 能使用原来项目写好的 React 组件

最后采用的方案，是使用 webpack 的开发模式，结合 HtmlWebpackPlugin 输出多页面，React+Mobx 写复杂交互的组件，同时可以复用以前的 React 组件。同时抛弃 jQuery，使用 fetch 代替 ajax，DOM 查询使用 querySelector()方法，其他辅助方法使用 lodash 插件。

## 模板代码模块化

### 加载

本架构采用个是`HtmlWebpackPlugin+underscore-template-loader`拼合拆分的模板文件，同时模板文件可以传入变量；
在 underscore-template-loader 中使用 lodash 的 template 方法，解析模板，语法是 ejs（使用‘<% %>’关键字输出变量）。

webpack 解析 html 的 rules：

```javascript
{
	test: /\.html$/,
	use: [
	  {
	    loader: 'underscore-template-loader',
	    options: {
	      attributes: ['img:src'],
	      engine: 'lodash',
	      prependFilenameComment: __dirname // 用于报错时查看模板路径
	    }
	  }
	]
}
```

将 HtmlWebpackPlugin 插件单独提出一个配置文件`webpack.config.tpl.js`，通过 config 中的 moduleList 配置，遍历出 HtmlWebpackPlugin 实例。

### 模块拆分

加载模板时，都是不是采用传统的直接加载 html 文件的方式，而是采用加载 js 配置文件，通过去 js 动态解析合并后再返回模板字符串。

在`webpack.config.tpl.js`配置中，template 字段加载 xxx/html.js 配置文件，该文件描述了本模块的 layout 模板和 content 模板。

如`src/pages/product/test/html.js`:

```javascript
const layout = require('layout/main/html')
const content = require('./content.html')

module.exports = layout
  .init({
    title: 'xxx',
    description: 'xxx',
  })
  .run(content())
```

_layout_

顾名思义，此文件描述当前模块的布局方式；
因为网站可能会有多个不一样的 header、nav 文件，同时有可能会有多个 footer。为了满足多种 layout 的需求，所以在项目中预制多种布局方式，如上述代码加载的是 main 模板，main 模板中有自己的 header 和 footer。

`tpl/layout/main/html.js`:

```js
const layout = require('./index.html') // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('tpl/components/header/index.html') // 页头的模板
const footer = require('tpl/components/footer/index.html') // 页脚的模板
// ...
```

## React + Mobx

因为项目需求，前端只要管理单个模块的数据，所以不需要使用 Redux。但是为了数据能有个统一管理的地方，所以使用的相对简单些的插件 mobx。

### 初始数据

在后端渲染页面时，将初始数据已 json 格式放到 header 中的 script 标签中，`src/tpl/components/header/index.html`：

```html
<script>
  window.__INITIAL_STATE__ = {test: {attr: 1111}}
</script>
```

后端对 `__INITIAL_STATE__` 赋初始值，前端获取到之后，放入当前 store 中, `utils/initStore.js`：

```js
function mergeObservables(target, source) {
  if (!source) {
    return target
  } else {
    for (let key in target) {
      if (typeof source[key] !== 'undefined') {
        target[key] = Object.assign(target[key], source[key])
      }
    }

    return target
  }
}

function initStore(store) {
  const source = window.__INITIAL_STATE__

  return mergeObservables(store, source)
}

export default initStore
```

通过 mobx-react 将数据绑定到 react props 中，react 通过这些数据渲染初始化界面。

### 数据更新

在 store 中定义 action 方法，如`src/stores/testStore.js`中注释的示例方法`fetchUserData`。
后端的 API 按后端模块统一放在 services 文件夹中统一管理，导出单例。更新或者获取后端数据。
与后端交互使用 fetch 代替 ajax，这是一个很成熟的异步后端交互的插件，用法类似于 ajax，返回 Promise 对象，在 Store 中使用非常方便。具体数据请求逻辑封装在`src/utils/requestData.js`。

## 抛弃 jQuery

由于现在 js 的 API 愈发强大和对浏览器的兼容越来越完善，以及各种框架的兴起，jQuery 就显得有些鸡肋。

本项目部分使用 react，react 本身不依赖 jQuery。在非 react 的地方，尝试将 jQuery 完全抛弃。我在项目中使用如下的替代品：

### Dom 操作

- 选择：`querySelectorAll()`、`querySelector()`等
- 插入：`innerHtml`、插入文本 `textContent`等很多新的 API
- class 操作：`clssList`和他的几个方法

### Ajax

对于 IE8+ 以上浏览器，在生产环境使用 Fetch 是完全可行的。

### 动画

CSS3 的动画+requestAnimationFrame 替换 jQuery 可以说是完全无压力的，而且从流畅的上来说，CSS 动画是远远优于 jQuery 的。

### 辅助函数

underscore 和 lodash 这两个插件库对 js 函数进行了大大的增强。配合上按需加载，也不用担心插件库冗余代码。

# 最后

其实本项目有在*传统铺页面前端开发*过度到现在流行的*模块化开发*有很大的参考价值。同时对于想在项目中部分使用 React 组件也有帮助。

模块化也不再依赖原来的 `#include`等等方式，而且可以直接使用 ES6 的语法，简直酸爽。

同样是前后端协同开发，将后端从一些复杂的前端逻辑中解放出来，只用去管一些简单的布局代码，实现部分前后端分离，对前端的技术要求也不会像直接分离式开发那样高，还是一种不错的过渡解决方案。
