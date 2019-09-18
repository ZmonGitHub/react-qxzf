import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
export default class CityList extends React.Component{
    render(){
        return (
            <NavBar
            mode="light"
            icon={<i className="iconfont icon-back" onClick={ () => this.props.history.go('-1') }></i>}
            onLeftClick={() => console.log('onLeftClick')}
            >城市选择</NavBar>
        )
    }
}