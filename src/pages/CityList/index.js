import React,{createRef} from 'react'
import { NavBar ,Toast} from 'antd-mobile'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
// 长列表插件
import { List, AutoSizer } from 'react-virtualized'
import './index.scss'

import NavHeader from '../../components/NavHeader'
const CITY_HEADER_HEIGHT = 35
const CITY_LIST_HEIGHT = 50
// 有房源城市数组
const CITY_WITH_HOUSE = ['北京', '上海', '广州', '深圳']
const formatCityList = (data) => {
    // 1:用来渲染数据列表 { a:[],b:[],c:[] },
    const cityList = {}
    data.forEach(item => {
        const firstLetter = item.short.slice(0, 1)
        // 判断，如果已经有了键，就直接添加值
        if (firstLetter in cityList) {
            // 如果已经存在就返回true 就走这里，没有走else
            cityList[firstLetter].push(item)
        } else {
            // 这里让他的值等于[数组Item，那么他的值就是一个数组了]
            cityList[firstLetter] = [item]
        }
    })
    // 需要两种数据格式，2: 用来渲染右侧索引['a','b','c'],并排序
    const cityIndex = Object.keys(cityList).sort()
    // sort默认从小打到排序
     return {
        cityList,
        cityIndex
    }
}
// 长列表
// List data as an array of strings

// 处理 列表名称
const formatCategory =(letter) =>{
    switch (letter) {
        case '#':
            return '当前定位'
        case '热':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends React.Component {
    state={
        cityList:{},
        cityIndex:[],
        activeIndex:0
    }
    // 创建 List 组件的ref
    listRef = createRef()
    // 挂在完成时钩子函数
    componentDidMount() {
        this.getCityList()
        // this.listRef.current.measureAllRows()
    }

     // 获取城市列表
     async getCityList() {

        const res = await axios.get('http://localhost:8080/area/city', {
            params: {
                level: 1
            }
        })
        const { cityIndex, cityList } = formatCityList(res.data.body)
        // 获取热门城市
        // console.log(cityIndex)
        const resHot = await axios.get('http://localhost:8080/area/hot')
        // console.log(resHot)
        cityList['热'] = resHot.data.body
        cityIndex.unshift('热')
        // console.log(cityIndex)
        // const { cityList,cityIndex } = formatCityList(res.data.body)
        // 返回的数据格式是 数组，数组里面包对象
        // console.log('set1')
        const { label, value } = await getCurrentCity()
        cityList['#'] = [{ label, value }]
        cityIndex.unshift('#')
        // 拿到定位地址
        this.setState({
            cityList,
            cityIndex
        },() => {
          // 注意： 这个回调函数执行的时候，组件已经完成渲染了
          //        此时，状态中已经有了 cityIndex 数据，并且 组件已经渲染完成了
          this.listRef.current.measureAllRows()
        })
    }

    // 长列表插件
    rowRenderer = ({ key, index, style }) => {
        const { cityList, cityIndex } = this.state
        // 获取每一行的分类（字母索引）
        const letter = cityIndex[index]
        // 获取到每个分类的城市列表
        const cities = cityList[letter]
        // console.log(cityList)
        
        return (
          <div key={key} style={style} className="city">
            <div className="title"> {formatCategory(letter)} </div>
            {cities.map(item => (
              <div key={item.value} className="name" onClick={()=>{
                  if(CITY_WITH_HOUSE.indexOf(item.label) > -1 ){
                    localStorage.setItem('hkzf_city',JSON.stringify({label:item.label,value:item.value}))
                    this.props.history.go(-1)
                  }else{
                 Toast.info('暂无房源')
                  }
              }}>
                {item.label}
              </div>
            ))}
          </div>
        )
    }
    calcRowHeight =({index}) => {
    //    console.log(index) 
    const {cityIndex,cityList } = this.state
    const letter = cityIndex[index]
    const length = cityList[letter].length
    // console.log(length)
    // 有时候函数名可能会造成误认为组件
    return CITY_HEADER_HEIGHT + CITY_LIST_HEIGHT * length
    }
    
    // 打开页面获取城市列表信息
    // 右侧索引
    // () => { this.listRef.current.scrollToRow(index)  
    renderCityIndex =() => {
        const  { activeIndex,cityIndex } = this.state
        // console.log(cityIndex)
        return cityIndex.map( (item,index) => (
            <li key={index} className="city-index-item" onClick={()=> {
                // console.log(index,this.listRef.current)  
                this.listRef.current.scrollToRow(index)
                 }}>
                <span className = {index===activeIndex ? 'index-active':''}> { item.toUpperCase() } </span>
            </li>
         ) )
    }
    onRowsRendered = ({startIndex}) => {
        // console.log(startIndex)
        // 根据active的下标来判断如果有变化，就让startIndex等于active
        if(startIndex !== this.state.activeIndex){
            this.setState({
            activeIndex :startIndex
            })
        }
    }

    render() {
        const { cityIndex } = this.state
        // console.log(cityIndex)
        return (
            <div className="cityList">
                <NavHeader>城市选择</NavHeader>
                {/* 长列表 */}
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={this.listRef}
                            height={height - 45}
                            rowCount={cityIndex.length}
                            rowHeight={this.calcRowHeight}
                            rowRenderer={this.rowRenderer}
                            width={width}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>
                {/* // 右侧城市索引列表： */}
                <ul className="city-index">
                {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}