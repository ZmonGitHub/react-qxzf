
// 职责配置路由
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router , Route ,Redirect } from 'react-router-dom'

// 导入页面
// './pages/Home/index.js' .js 后缀 以及 index 都可以省略。
// 因为在导入模块时，会自动查找 index.js
import Home from './pages/Home'
// 首屏不要懒加载，因为懒加载会增加http请求次数，造成不必要的浪费
const CityList = lazy(()=>import ('./pages/CityList'))
const Map = lazy(()=>import ('./pages/Map'))
const Details = lazy(()=>import ('./pages/details'))
const Profile = lazy(()=>import ('./pages/Profile'))
const Login = lazy(()=>import ('./pages/Login'))
const Rent = lazy(()=>import ('./pages/Rent'))
const RentAdd = lazy(()=>import ('./pages/Rent/Add'))
const RentSearch = lazy(()=>import ('./pages/Rent/Search'))
// 导入AuthRoute鉴权路由
const AuthRoute =lazy(()=>import ('./components/AuthRoute'))

// 模拟一个组件测试鉴权路由
// const RentAdd = props => {
//     return (
//         <h1>
//           这是出租房屋页面，需要登录后才能访问{' '}
//           <button onClick={() => props.history.go(-1)}>返回</button>
//         </h1>
//       )
//   }


// 没有状态的更新用无状态函数组件
const App = () => {
    return (
        <Router>
        <Suspense fallback={<div>Loading...</div>}>
        <div className="App">
            {/* 需要一个重定向,注意一定要加上exact，不然所有的/都会跑到home */}
        <Route exact path="/" render={ () => <Redirect to="/home"></Redirect> }></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/details/:id" component={Details}></Route>
        <Route path="/profile" component={Profile} ></Route>
        <Route path="/login" component={Login} ></Route>
        {/* 配置需要登录才能访问的鉴权路由 */}
        {/* /rent需要精准匹配，不然每次都显示 */}
        <AuthRoute exact path="/rent" component={Rent} ></AuthRoute>
        <AuthRoute path="/rent/add" component={RentAdd} ></AuthRoute>
        <AuthRoute path="/rent/search" component={RentSearch} ></AuthRoute>
        </div>
        </Suspense>
        </Router>
    )
} 

export default App