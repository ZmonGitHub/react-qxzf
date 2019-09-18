import React from 'react'
import ReactDOM from 'react-dom'

// 引入全局样式，覆盖插件UI的
import 'antd-mobile/dist/antd-mobile.css'
import './index.css'
import './assets/fonts/iconfont.css'
// 导入App 根组件
import App from './App'
ReactDOM.render(<App></App>,document.getElementById('root'))
// 渲染根组件,这个是项目入口文件