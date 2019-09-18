
// 职责配置路由
import React from 'react'
import { BrowserRouter as Router , Route ,Redirect } from 'react-router-dom'

// 导入页面
// './pages/Home/index.js' .js 后缀 以及 index 都可以省略。
// 因为在导入模块时，会自动查找 index.js
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

// 没有状态的更新用无状态函数组件
const App = () => {
    return (
        <Router>
        <div className="App">
            {/* 需要一个重定向 */}
        <Route path="/" render={ () => <Redirect to="/home"></Redirect> }></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList}></Route>
        </div>
        </Router>
    )
} 

export default App