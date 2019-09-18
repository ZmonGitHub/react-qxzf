import React from 'react'
// 导入路由
import {Route} from 'react-router-dom'
// 导入mobileUI
import { TabBar } from 'antd-mobile'
// 引入样式
import './index.css'
// 引入的四个子组件
import News from '../News'
import Profile from '../Profile'
import Index from '../Index'
import HouseList from '../HouseList'

// 把数据抽出来进行渲染
const barList = [
    {title:"首页",icon:"icon-ind",pathname:"/home" },
    {title:"找房",icon:"icon-findHouse",pathname:"/home/HouseList" },
    {title:"资讯",icon:"icon-infom",pathname:"/home/news" },
    {title:"我的",icon:"icon-my",pathname:"/home/profile" },
]
export default class Home extends React.Component{
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            // 默认选中的tab栏
          selectedTab: props.location.pathname,
        }
      }
    componentDidUpdate(prevProps){
        // 更新阶段的钩子函数不能直接修改state的内容会死循环,要有一个判断条件
        if(prevProps.location.pathname !== this.props.location.pathname){
            this.setState({
                selectedTab:this.props.location.pathname
            })
            // console.log(this.props.location.pathname)
        }
        // console.log(prevProps)
    }
    forTabBar(){
        return barList.map( item => (
            <TabBar.Item
                    title={item.title}
                    key={item.title}
                    // 默认展示图片
                    icon={<i className={`iconfont ${item.icon}`}></i>}
                    // 选中后的展示图片
                    selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                    // 是否选中
                    selected={this.state.selectedTab === item.pathname}
                    // 选中的内容对比selectedTab
                    // 徽标数
                    // badge={1}
                    onPress={() => {
                    // bar 点击触发，需要自己改变组件 state & selecte={true}
                    this.setState({
                        selectedTab: item.pathname,
                    })
                    // console.log(this.props)
                    this.props.history.push(item.pathname)
                    }}
                    data-seed="logId"
                >
                </TabBar.Item>
        ) )
    }
    render() {
        return (
            <div className="index">
                {/* Home组件是主组件，包含了导航内的四个分页 */}
                {/* 这是Home组件 */}
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/profile" component={Profile}></Route>
                <Route path="/home/houseList" component={HouseList}></Route>
                <div className="tabBar">
                <TabBar
                // 未选中的字体颜色
                    unselectedTintColor="#949494"
                // 选中的字体颜色
                    tintColor="rgb(33, 185, 122)"
                // tabbar 背景色
                    barTintColor="white"
                // 不渲染内容部分
                    noRenderContent={true}
                    >

                {/* ----------循环遍历tabBar.item */}

                {
                    this.forTabBar()
                }
                {/* ----------------------------- */}
                </TabBar>
                </div>
             </div>
            
        )
    }
}
