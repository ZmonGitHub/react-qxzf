
import {NavBar}  from 'antd-mobile'
import React from 'react'
// 导入高阶组件withRouter,自己写的组件是没有history属性的，需要用高阶组件路由包裹才能有
import {withRouter} from 'react-router-dom'
// 再引入 classNames包
import classnames from 'classnames'
// 引入类型校验包
import PropTypes from 'prop-types'
function NavHeader(props) {
    return (
        <NavBar
        className={classnames('nav-bar',props.className)}
        mode="light"
        icon={<i className="iconfont icon-back" ></i>}
        onLeftClick={() => props.history.go('-1')}
        >
            {props.children}
        </NavBar>
    )
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    // children属性接收的值必须是字符串必填
    className:PropTypes.string
    // className属性的值必须是字符串，不是必须填写
}
export default withRouter(NavHeader)