// 鉴权路由组件
import React from 'react'
// 路由，重定向
import { Route,Redirect } from 'react-router-dom'
// isAuth方法判断是否登录
import { isAuth } from '../../utils'

// AuthRoute 组件的使用方式与 Route 组件要保持一致
// 使用方式： <AuthRoute exact path="/rent/add" component={RentAdd} />
const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => {
            // 判断是否登录,高阶组件，render props
            console.log('高阶组件',props)
            if(isAuth()){
                // 如果登录了就直接渲染component组件
            return <Component {...props}></Component>
            }
            return (
                // 如果没有登录，就重定向到登录页面，并且将用户要访问的路由地址一起传递给登录页面
                <Redirect 
                    to={{ 
                        // 重定向
                        pathname:'/login',
                        // 携带重定向前的地址信息，登录后调回
                        state:props.location
                     }} />
            )
        }} />
    )
}

export default AuthRoute