import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity,API } from '../../../utils'

// 引入lodash防抖函数
import _ from 'lodash' 

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }
  // 搜索框输入时间
  // lodash防抖函数插件
  searchCommunity = _.debounce( async searchTxt => {

    const res = await API.get('/area/community',{
      params:{
        name:searchTxt,
        id:this.cityId
      }
    })

    console.log(res)

    this.setState({
      tipsList:res.data.body
    })},500)

  handelValue = async (searchTxt) => {
    console.log(searchTxt)
    this.setState({
      searchTxt
    })
    // 这个是防抖函数, 记得传参数，不然那边函数拿不到数据
    this.searchCommunity(searchTxt)
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} onClick={ () =>(
        // 跳转页面并传递数据
        this.props.history.replace('/rent/add',{
          id:item.community,
          // 小区的id，名字
          name: item.communityName
        })
      )} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handelValue}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
