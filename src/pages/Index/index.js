import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import React, { Component } from 'react'
import axios from 'axios'
// import './index.css'
import './index.scss'
import {BASE_URL} from '../../utils/url'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// NAV导航数据
const flexList = [
    { imgSrc: Nav1, name: '整租', path: '/home/HouseList' },
    { imgSrc: Nav2, name: '合租', path: '/home/HouseList' },
    { imgSrc: Nav3, name: '地图找房', path: '/map' },
    { imgSrc: Nav4, name: '去出租', path: '/rent/add' },
]

const BMap = window.BMap
export default class Index extends Component {
    state = {
        data: [],
        imgHeight: 212,
        flag: false,
        groups: [],
        news: [],
        GPS: "上海"
    }
    //   钩子函数挂载完成时
    componentDidMount() {
        // 发送轮播图ajax
        this.getAutoChartList()
        // 发送租房小组ajax
        this.getGroupList()
        // 发送最新资讯AJAX
        this.getNewsList()
        // 获取当前位置
        // this.getGPSMap()
        const myCity = new BMap.LocalCity()
        myCity.get(async (result) => {
        //    console.log(result) 
        //    根据ip拿到了当前城市名字,根据名字发送ajax给后台拿到城市数据
            await axios.get('http://localhost:8080/area/info',{
                params:{
                    name:result.name
                }
            })
            // console.log(res)
            // 事件是没有this
            localStorage.getItem('hkzf_city')
            // console.log()
            this.setState({
                GPS:JSON.parse(localStorage.getItem('hkzf_city')).label
            })
            // console.log(this.setState())
        })
    }
    async getNewsList() {
        const res = await axios.get('http://localhost:8080/home/news', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            news: res.data.body
        })
        // console.log(res)
    }
    async getGroupList() {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            groups: res.data.body
        })
        // console.log(res)
    }
    // 发送ajax
    async getAutoChartList() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        // console.log(res)
        this.setState({
            data: res.data.body,
            flag: true
        })
    }
    // 轮播图
    autoChart() {
        return this.state.data.map(item => (
            <a
                key={item}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
                <img
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                    }}
                />
            </a>
        ))
    }
    // 渲染NAV导航
    forFlex() {
        return flexList.map(item => (
            <Flex.Item key={item.name} onClick={() => this.props.history.push(item.path)}>
                <img src={item.imgSrc} alt="" />
                <p> {item.name} </p>
            </Flex.Item>
        ))
    }
    // 渲染最新资讯
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img
                        className="img"
                        src={`${BASE_URL}${item.imgSrc}`}
                        alt=""
                    />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }
    render() {
        return (
            <div className="index">
                <div className="rotate">
                    {/* 顶部搜索栏 */}
                    <Flex className="search-nav">
                        {/* 左边 */}
                        <Flex className="left-nav">
                            <div onClick={()=> this.props.history.push('/citylist')}>
                                <span>{this.state.GPS}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            <div className="clickText">
                                <i className="iconfont icon-seach"></i>
                                <span>请输入小区或地址</span>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}>

                        </i>
                        {/* 右边 */}
                    </Flex>
                    {/* 轮播图 */}
                    <div className="height212">
                        {
                            this.state.flag && (
                                <Carousel autoplay infinite>
                                    {this.autoChart()}
                                </Carousel>)
                        }
                    </div>
                </div>

                {/* flex布局NAV */}
                <Flex size="end" className="nav">{this.forFlex()} </Flex>
                {/* 租房小组 */}
                <div className="groups">
                    <Flex className="groups-title" justify="between">
                        <h3>租房小组</h3>
                        <span>更多</span>
                    </Flex>
                    {/* rendeItem 属性：用来 自定义 每一个单元格中的结构 */}
                    <Grid
                        data={this.state.groups}
                        columnNum={2}
                        square={false}
                        activeStyle
                        hasLine={false}
                        renderItem={item => (
                            <Flex className="grid-item" justify="between">
                                <div className="desc">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                            </Flex>
                        )}
                    />
                </div>
                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
            </div>
        )
    }
}

