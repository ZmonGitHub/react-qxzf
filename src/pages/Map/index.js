import React, { Component } from 'react'
// import { NavBar } from 'antd-mobile'
import axios from 'axios'
import NavHeader from '../../components/NavHeader'
import './index.scss'
import classnames from 'classnames'
// 引入ui
import {Toast} from 'antd-mobile'
// 百度获取当前位置方法
import {getCurrentCity} from '../../utils'
// 当前页面的样式
import styles from './index.module.scss'
const BMap = window.BMap
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }
export default class Map extends Component {
    state={
        list:[],
        isShowHouseList:false
    }
    async componentDidMount(){
        const map = new BMap.Map("container")
        this.map = map
        // 获取当前定位城市,因为是异步的，所以要用await，不然会undefind
        const {label,value} =await getCurrentCity()
        // console.log(label)
        // 创建地址解析器实例     
        const myGeo = new BMap.Geocoder()
        map.addEventListener('movestart', () => {
          // 隐藏房源列表
          // console.log('滚动事件')
          if( this.state.isShowHouseList){
            this.setState({
              isShowHouseList:false
            })
          }
          })
        myGeo.getPoint(label,async (point)=>{     
            // 初始化地图
            map.centerAndZoom(point, 11);      
            // 两个控件
            map.addControl(new BMap.ScaleControl())
            map.addControl(new BMap.NavigationControl())  
            // 调用 renderOverlays 方法，渲染覆盖物,value是唯一标识
            this.renderOverlays(value)
            // 遍历各区房源信息
         }, 
        label)
    }
    async renderOverlays(id){
      // 必须放在一个函数中
    Toast.loading('加载中..',0)
    // 1 进入页面时，发送请求获取当前城市下所有区的数据
    const res =await axios.get('http://localhost:8080/area/map',{
        params:{
            id
        }
    })
    // 关闭loading
    Toast.hide()
    // 希望拿到 区域类型 和 缩放等级
    const { type,level }  = this.getTypeAndZoom()
    // console.log(res)
    // 循环遍历数据渲染
    res.data.body.forEach(item => {
        this.createOverlays(type, level, item)
    })
    }
    // 获取到要渲染的覆盖物类型以及下一级缩放级别
  // 思路： 根据地图的缩放级别，来决定渲染覆盖物的类型
    getTypeAndZoom() {
        // 通过getZoom方法拿到缩放等级
    const zoom = this.map.getZoom()   
    // console.log(zoom)
    let type,nextLevel
    // nextLevel是点击后的缩放等级
    if(zoom === 11 || zoom === 13){
        //区或者镇
        type="circle"
        nextLevel = zoom + 2
        // console.log(nextLevel)
    }else if(zoom === 15){
        type="rect"
        // console.log('到15了')
    }
    return {
        type,level:nextLevel
    }
    }

  // 接收数据，根据覆盖物的类型决定调用哪个方法来创建对应的覆盖物
    createOverlays(type, level, data){
        // data是res.data.body.forEach(item 的item
        const {
             // 继续解构 coord 对象
        coord: { latitude, longitude },
        label,
        count,
        value
        } = data
        const point = new BMap.Point(longitude,latitude)
        // 两种情况来决定渲染了类型
        if(type === 'circle'){
            // 区和镇的覆盖物
            this.createCircle(point, label, count, value, level)
        }else{
            // 创建小区覆盖物,不需要级别了，
           this.createRect(point, label, count, value)
        }
    }
    // 创建区或镇的覆盖物
  // point 当前覆盖物的坐标
  // areaName 区域名称
  // count 房源数量
  // id 区域的id
  // level 下级缩放级别
  createCircle(point, areaName, count, id, level){
    const opts = {
        position : point,    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(-35, -35)    //设置文本偏移量
        }
        // 创建文本标注对象
        const label = new BMap.Label("", opts) 
        // 设置覆盖物文本结构内容
        label.setContent(`
        <div class="${styles.bubble}">
        <p class="${styles.name}">${areaName}</p>
        <p>${count}套</p>
        </div>
        `)
        // setStyle是设置文本样式
        label.setStyle(labelStyle)
        // 给文本添加点击事件
        label.addEventListener('click',() => {
            // 放大地图，清除覆盖物
            this.map.centerAndZoom(point, level)
            setTimeout(()=>{
                this.map.clearOverlays()
            },0)
            // 点击后渲染镇
            this.renderOverlays(id)
        })
        // map调用add方法就可以
        this.map.addOverlay(label)
  }
        //   创建小区覆盖物
    createRect(point, areaName, count, id){
      // console.log('走了小区覆盖物')
        // 创建文本覆盖物
        const opts = {
            // 指定文本标注所在的地理位置
            position: point,
            //设置文本偏移量
            offset: new BMap.Size(-50, -28)
        }
        // 创建文本标注对象
        // 因为通过 setContent 方法设置过内容了，所以，第一个参数中字符串内容就无效了
        const label = new BMap.Label('', opts)

            // 设置 HTML 内容
            // 注意：这个方法接收的参数是原生的HTML不是 JSX！！！
        label.setContent(`
        <div class="${styles.rect}">
        <span class="${styles.housename}">${areaName}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
        </div>
        `)
         // 文本标注的样式
        label.setStyle(labelStyle)
        // 给 label 覆盖物绑定单击事件
        // 点击小区后展开小区内的房源信息
        label.addEventListener('click', (e) => {
        // console.log('小区被点击了',e)
        // 中心点 x： window.innerWidth / 2
        // 中心点 y： (window.innerHeight - 330 - 45) / 2 + 45
        //
        // 偏移值 x： 中心点x - 被点击的x = 等一个负值，就是要移动的距离
        // 偏移值 y： 中心点y - 被点击的y
        const {clientX,clientY} = e.changedTouches[0]
        const x = window.innerWidth / 2 - clientX
        const y = (window.innerHeight - 330 - 45) / 2 + 45 - clientY
        this.map.panBy(x, y) 
        this.getHosiList(id)
        
        })
      // 将覆盖物添加到地图中
       this.map.addOverlay(label)
    }
    async getHosiList(id){
    Toast.loading('加载中..',0)
     const res= await axios.get('http://localhost:8080/houses',{
            params:{
                cityId:id
            }
        })
        Toast.hide()
       this.setState({
          list: res.data.body.list,
          isShowHouseList: true
      })

    }
    renderHouseList(){
      const { list } =this.state
      return list.map((item,index) => (
        
        <div onClick={ ()=> this.props.history.push(`/details/${item.houseCode}`) } key={index} className={styles.house}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://localhost:8080${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {item.title}
            </h3>
            <div className={styles.desc}> {item.desc} </div>
            <div>
             {
               item.tags.map( (tag,index) => {
                const tagClass = index >2 ? 'tag3' : `tag${index+1}`
               return (<span key={index} className={classnames(styles.tag,styles[tagClass])}>
                      {tag}
                     </span>)
               })
               }
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}> {item.price} </span> 元/月
            </div>
          </div>
        </div>
      
      ))
    }
    render() {
        // 动态设置是否显示房源列表
        const { isShowHouseList } = this.state
        return (
            <div className="map">
                    <NavHeader className={styles.nav}>城市选择</NavHeader>
                    <div id="container"></div> 
                    {/* 房屋列表结构 */}
              <div
                className={classnames(styles.houseList, {
                  [styles.show]: isShowHouseList
                })}
              >
              {/* 列表头部 */}
              <div className={styles.titleWrap}>
                <h1 className={styles.listTitle}>房屋列表</h1>
                <a className={styles.titleMore} href="/house/list">
                  更多房源
                </a>
              </div>
                <div className={styles.houseItems}> {this.renderHouseList()} </div>
            </div>
            </div>
        )
    }
}
