import React from 'react'
import ReactDOM from 'react-dom'
// 'react-virtualized样式，长列表
import 'react-virtualized/styles.css'
// 引入全局样式，覆盖插件UI的
// 已经使用了按需加载，不需要手动导入antd mobile css样式了
// import 'antd-mobile/dist/antd-mobile.css'
import './assets/fonts/iconfont.css'
// 导入App 根组件
import App from './App'
import './index.css'
ReactDOM.render(<App></App>,document.getElementById('root'))
// 渲染根组件,这个是项目入口文件