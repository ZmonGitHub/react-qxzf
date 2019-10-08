import React, { Component } from 'react'
import { Flex,WingBlank,Toast } from 'antd-mobile'
// 引入定位组件 和 API组件
import { API , getCurrentCity } from '../../utils'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
// filter筛选条件组件
import Filter from './components/Filter'
// 引入Nohome组件
import NoHouse from '../../components/NoHouse'
// 引入吸顶组件sticky
import Sticky from '../../components/Sticky'

import { List, AutoSizer, WindowScroller,InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
// const {label} = JSON.parse(localStorage.getItem('hkzf_city'))
export default class HouseList extends Component  {
    state={
        // 数据列表
        list:[],
        // 数据总数
        count:0,
        cityName:'上海',
        cityId:'',
        flag:true
    }
    async componentDidMount(){
        const { value, label } = await getCurrentCity()
        // console.log(value,label)
        this.cityId = value
        this.setState({
            cityName:label
        })
        this.searchHouseList()
        // 数据更新走render更新数据渲染页面
    }
    onFilter = (filters) => {
        // console.log(filters)
        // 每次渲染数据，到窗口的那个位置（x,y）
        window.scrollTo(0,0)
        this.filters = filters
        this.searchHouseList()
    }
    // 应该点击Ok 的时候再重新渲染数据
    async searchHouseList(){
        // 渲染列表
        // console.log('sear执行了')
    // 请求数据时，提示loding
    this.setState({
        flag:true
    })
    Toast.loading('正在加载..', 0)
     const res = await API.get('/houses',{
        params: {
            ...this.filters,
            // cityId: 'AREA|88cff55c-aaa4-e2e0',
            cityId: this.cityId,
            start: 1,
            end: 20
          }
     }) 
    Toast.hide()
    //  console.log(res)
    //  数据没有问题
     const { list, count } = res.data.body
    //  数据更新走render
    // console.log(list,count)
     this.setState({
        count,
        list,
        flag:false
      })
    }
    getIdpush = (id) => {
        // 先拿到点击目标的id，拿到后通过URL地址栏传递给details。
        // console.log(id)
        this.props.history.push(`/details/${id}`)
    }
    // 渲染列表项
    rowRenderer = ({ key, index, style }) => {
        // console.log(index)
        const { list } = this.state
        const item = list[index]
        // console.log(item.houseCode)
        if (!item) {
            // 数据加载中
            return (
              <div key={key} style={style}>
                <p className={styles.loading} />
              </div>
            )
          }
        return <HouseItem key={key} {...item} onClick={()=> this.getIdpush(item.houseCode)} style={style} />
    }
    
    // 用来判断每一行是否加载完成
    isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
    }
    // 用来加载更多数据
    loadMoreRows = ({ startIndex, stopIndex }) => {
        // console.log(startIndex, stopIndex)
        return new Promise(async resolve => {
        const res = await API.get('/houses', {
            params: {
            ...this.filters,
            // cityId: 'AREA|88cff55c-aaa4-e2e0',
            cityId: this.cityId,
            start: startIndex,
            end: stopIndex
            }
        })
        // 数据加载完成后，完成该 Promise
        resolve()

        const { list, count } = res.data.body
        this.setState({
            // 追加数据，而不是覆盖数据
            list: [...this.state.list, ...list],
            count
        })
        })
    }
    renderHostList(){
        // 注意，如果用函数包裹组件必须用return
        const {count,flag} = this.state
        if(flag === false && count === 0){
            return (<NoHouse>没有找到房源，请换一个搜索条件吧~</NoHouse>)
        }
        // <NoHouse>没有找到房源，请换一个搜索条件吧~</NoHouse>
        return(
            <InfiniteLoader
            rowCount={count}
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            >
            {({ onRowsRendered, registerChild }) => (
          <WingBlank>
            <WindowScroller>
                {/* 作用：让 List 组件跟随页面滚动 */}
            {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                {/* 沾满全屏 */}
                {({ width }) => (
                    // 数据列表
                    <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    height={height - 45}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    width={width}
                    rowCount={count}
                    rowHeight={130}
                    rowRenderer={this.rowRenderer}
                    />
                )}
                </AutoSizer>
            )}
            </WindowScroller>
            </WingBlank>
        )}
        </InfiniteLoader>
        )
    }
    render(){
        const {cityName} = this.state
        return (
            <div >
                <Flex className={styles.headerNav}>
                {/* 这个是顶部的导航栏 */}
                <i className="iconfont icon-back" onClick={()=> this.props.history.go(-1)}></i>
                <SearchHeader cityName={cityName}></SearchHeader>
                </Flex>
                {/* 自制吸顶组件 */}
                <Sticky height={45}>
                {/* 条件筛选栏 */}
                <Filter onFilter={this.onFilter} />
                </Sticky>
                  {/* 房源列表 */}
                {this.renderHostList()}
                 
            </div>
        )
    }
    
}
