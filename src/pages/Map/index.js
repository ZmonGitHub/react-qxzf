import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'
import './index.scss'
const BMap = window.BMap
export default class Map extends Component {
    componentDidMount(){
        const map = new BMap.Map("container")
        const point = new BMap.Point(121.48023738884737, 31.236304654494646)
        map.centerAndZoom(point, 15)
    }
    render() {
        return (
            <div className="map">
                    <NavBar
                    mode="light"
                    icon={<i className="iconfont icon-back" onClick={ () => this.props.history.go('-1') }></i>}
                    onLeftClick={() => console.log('onLeftClick')}
                    >地图找房</NavBar>
                    <div id="container"></div> 
            </div>
        )
    }
}
