import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

import classnames from 'classnames'

export default class FilterMore extends Component {
  state={
    selectedValues: this.props.defaultValue
  }

  handleClick = (value) =>{
    // 点击可以拿到当前点击的值
    console.log(value)
    const { selectedValues } = this.state
    // 判断，如果数组中有这个值 就移出，没有就添加
    let newSelectedValues
    if ( selectedValues.indexOf(value) <= -1 ){
      // 那就是没有
      newSelectedValues = [...selectedValues,value]
    }else {
      // 如果有就移出
      newSelectedValues = selectedValues.filter( item => {
        return item !== value
      } )
    }
    this.setState({
      selectedValues:newSelectedValues
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    
    return data.map( item => {
      const isSelected = this.state.selectedValues.indexOf(item.value) > -1
      // 如果 > -1就是有这个值
      return (
        <span key={item.value} className={classnames(styles.tag,{ [styles.tagActive]:isSelected })} onClick={ ()=> this.handleClick(item.value)}> {item.label}  </span>
      )
    } )
  }

  render() {
    // 所有的操作都在父组件中操作
    const { data:{roomType, oriented, floor, characteristic},onOk,onCancel } = this.props
    const {selectedValues} = this.state

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        {/* selectedValues选中的值 */}
        <FilterFooter cancelText='清除' onCancel={ ()=> this.setState({
          selectedValues:[]
          // 等于一个空数组，清空了选中内容，但是父组件没有清空~
        }) } onOk={ () => onOk(selectedValues)} className={styles.footer} />
      </div>
    )
  }
}
