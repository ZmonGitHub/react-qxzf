// 职责配置路由
import React from 'react'
import { BrowserRouter as Router , Link , Route } from 'react-router-dom'

// 导入页面
// './pages/Home/index.js' .js 后缀 以及 index 都可以省略。
// 因为在导入模块时，会自动查找 index.js
import Home from './pages/Home'
import CityList from './pages/CityList'

// 没有状态的更新用无状态函数组件
const App = () => {
    return (
        <Router>
        <div className="App">
        <Link to="/home">首页</Link>
        <br/>
        <Link to="/citylist">城市选择</Link>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        </div>
        </Router>
    )
} 

export default App