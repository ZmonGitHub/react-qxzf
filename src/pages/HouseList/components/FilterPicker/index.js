import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'



export default class FilterPicker extends Component {
  state={
    value:this.props.defaultValue
  }
  handleChange=(value)=>{
    // console.log(value)
    this.setState({
      value
    })
  }
  render() {
    const { onCancel,data,cols,onOK } = this.props
    // value数据是从当前页拿到传给父组件
    const {value} = this.state
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} cols={cols} value={value} onChange={this.handleChange} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={ ()=> onOK(value) }  />
      </>
    )
  }
}
