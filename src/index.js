import React from 'react'
import ReactDOM from 'react-dom'

// 引入全局样式，覆盖插件UI的
import 'antd-mobile/lib/date-picker/style/css'; 
import './index.css'
// 导入App 根组件
import App from './App'
ReactDOM.render(<App></App>,document.getElementById('root'))