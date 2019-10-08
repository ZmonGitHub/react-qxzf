import React, { Component } from 'react'
// 导入三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import styles from './index.module.css'
import { API,getCurrentCity } from '../../../../utils'
// 导入动画组件
import {Spring} from 'react-spring/renderprops'
// 标题高亮状态对象
// 键： 表示每个标题的 type （类型）
// 值： 布尔值，如果为true表示高亮；为false，表示不亮
const titleSelectedStatus = {
  area:false,
  mode:false,
  price:false,
  more:false
}
export default class Filter extends Component {
  state={
    // 标题高亮对象
    titleSelectedStatus,
    openType:'',
    filtersData:{},
    // 每个标题对应的选中条件对象
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    },
    cityId:''
  }
  // 发送ajax拿到数据
  async componentDidMount(){
    const {value} =await getCurrentCity()
    // 拿到bodyDOM
    this.htmlBody = document.body
    // console.log(this.props)
    this.setState({
      cityId:value
    })
    // console.log(this.state.cityId)
    // console.log(value,label)
    this.getFiltersData()
  }
   getFiltersData = async() => {
    const res = await API.get('http://localhost:8080/houses/condition',{
      params:{
        // 数据拿到的时候编译后的id，需要用浏览器decodeURI('AREA%7C88cff55c-aaa4-e2e0')拿到解析前的才行
        id:this.state.cityId
        // 城市id写死了北京，需要写成变量
      }
    })
    this.setState({
      filtersData:res.data.body
    })
    // 现在拿到的是北京的数据
    // console.log(res)
  }
  // type是被点击触发的回调函数,type=标题类型
  changeTitle = (type)=>{
    this.htmlBody.classList.add('overFixed')
    // 样式写在Index里面，因为只有index才有body，其他组件都没有body标签
    // 点击那个标题 就把该标题高亮，并打开对话框,type是哪个title标题
    // console.log('触发父点击事件',type)
    // 完善高亮
    // ① 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
    const { titleSelectedStatus,selectedValues } =this.state
    // ② 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
    const newTitleSelectedStatus = {...titleSelectedStatus}
    // ③ 使用 Object.keys() 方法，遍历标题选中状态对象。
    Object.keys(titleSelectedStatus).forEach( key => {
      // 当前菜单的选中值,是一个数组
      const selected = selectedValues[key]
      if(type === key){
        //当前被点击的菜单
        newTitleSelectedStatus[key] = true
      }else{
      const isSelected =  this.getTitleSelectedStatus(key,selected)
      newTitleSelectedStatus[key] = isSelected
      }
      //  if(key === 'area' && (selected.length === 3 || selected[0] !== 'area')){
      //   // 长度等于3，那就有手动选择条件，如果不是area 那就是选择了地铁
      //   newTitleSelectedStatus.area = true
      // }else if(key === 'mode' && selected[0] !=='null' ){
      //   // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      //   newTitleSelectedStatus.mode = true
      // }else if(key === 'price' && selected[0] !=='null' ){
      //   // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      //   newTitleSelectedStatus.price = true
      // }else if(key === 'more' ){
      //    // 更多筛选条件，等到该组件功能完成后，再补充
      //    newTitleSelectedStatus.more = true
      // }else{
      //   // 其他情况都是false
      //   newTitleSelectedStatus[key] = false
      // }
    } )
    // ④ 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。
    // ⑤ 否则，分别判断每个标题的选中值是否与默认值相同。
    // ⑥ 如果不同，则设置该标题的选中状态为 true。
    // ⑦ 如果相同，则设置该标题的选中状态为 false。
    // ⑧ 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
    this.setState({
      // 使用js语法就要用{}
      titleSelectedStatus:newTitleSelectedStatus,
      openType:type
    })
  }
   // 参数 value： 表示当前的选中值,点击确定拿到当前选中的值
  onOK = (value) => {
    // console.log('onOk',value)
    this.htmlBody.classList.remove('overFixed')
    const { titleSelectedStatus,openType } =this.state
    // ② 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
    // const newTitleSelectedStatus = {...titleSelectedStatus}
    // ③ 使用 Object.keys() 方法，遍历标题选中状态对象。
    const isSelected = this.getTitleSelectedStatus(openType,value)
    // 组装所有的筛选条件数据，然后传给父组件
    const newSelectedValues = {
      ...this.state.selectedValues,
      [openType]:value
    }
    const filters = {}
    // 区域
    // 区域： area or subway
    // 键key：            selectedValues.area[0]
    // 值value：          如果选中值长度为 2 ，值为： 
    // selectedValues.area[1]
    // 如果选中值长度为 3 ，值为： 
    // selectedValues.area[2] === 'null' ? selectedValues.area[1] :
    //  selectedValues.area[2]
    const key = newSelectedValues.area[0]
    // 第一个值
    let areaValue
    if(newSelectedValues.area.length === 2 ){
      areaValue = newSelectedValues.area[1]
    }else{
     areaValue = newSelectedValues.area[2] === 'null' ? newSelectedValues.area[1] :newSelectedValues.area[2]
    }
    filters[key] = areaValue
    // 租赁方式
    filters.rentType = newSelectedValues.mode[0]
    // 租金
    filters.price = newSelectedValues.price[0]
    // 更多筛选
    filters.more = newSelectedValues.more.join(',')
    // console.log(filters)
    // filter组装后的所有筛选数据
    this.props.onFilter(filters)
    this.setState({
      openType:'',
      titleSelectedStatus:{...titleSelectedStatus,[openType]:isSelected},
      selectedValues: newSelectedValues
    })
  }
  // 渲染前三个点击后的显示组件
  renderFilterPicker(){
    const { openType,selectedValues,
      filtersData: { rentType, price, area, subway } } = this.state
      // 拿到openType得到当前点击的标题，filterData是数据
    // 根据条件进行渲染,如果这几个都不是，那就返回null,只要有一个是就执行下面的代码
    if(openType !== 'area' && openType !== 'mode' && openType !== 'price' ){
      return null 
    }
    // data是数据源，cols是列数
    let data,cols = 1 
    // defaultValue 默认选中值
    const defaultValue = selectedValues[openType]
    // 因为前面三个菜单都对应到这个同一个组件，所以，需要根据菜单的类型来获取到对应的数据
    switch(openType){
      case 'area':
        data = [area,subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        break
      case 'price':
        data = price
        break
      default:
        throw new Error('openType is error!')
    }
    return (
      <FilterPicker
      key={openType}
      onCancel={this.onCancel}
      data={data}
      cols={cols}
      defaultValue={defaultValue}
      type={openType}
      onOK={this.onOK}
    />
    )
  }
  getTitleSelectedStatus=(openType, selected)=>{
    let isSelected = false
    if(openType === 'area' && (selected.length === 3 || selected[0] !== 'area')){
      // 长度等于3，那就有手动选择条件，如果不是area 那就是选择了地铁
      isSelected = true
    }else if(openType === 'mode' && selected[0] !=='null' ){
      // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      isSelected = true
    }else if(openType === 'price' && selected[0] !=='null' ){
      // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      isSelected = true
    }else if(openType === 'more' && selected.length > 0){
       // 更多筛选条件，等到该组件功能完成后，再补充
       isSelected = true
    }else{
      // 其他情况都是false
      isSelected = false
    }
    // 每次只更新一个
    return isSelected
  }
  // 点击遮罩层或者取消，关闭遮罩层和对话框
  onCancel = ()=>{
    this.htmlBody.classList.remove('overFixed')

    const { titleSelectedStatus,openType,selectedValues } =this.state
    // ② 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
    // const newTitleSelectedStatus = {...titleSelectedStatus}
    // ③ 使用 Object.keys() 方法，遍历标题选中状态对象。
    // 选中值
    const selected = selectedValues[openType]
    const isSelected = this.getTitleSelectedStatus(openType, selected)
      // if(openType === 'area' && (selected.length === 3 || selected[0] !== 'area')){
      //   // 长度等于3，那就有手动选择条件，如果不是area 那就是选择了地铁
      //   newTitleSelectedStatus.area = true
      // }else if(openType === 'mode' && selected[0] !=='null' ){
      //   // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      //   newTitleSelectedStatus.mode = true
      // }else if(openType === 'price' && selected[0] !=='null' ){
      //   // 如果当前选中的是mode并且 第一个值不是Null 那么就是手动选择了条件
      //   newTitleSelectedStatus.price = true
      // }else if(openType === 'more' ){
      //    // 更多筛选条件，等到该组件功能完成后，再补充
      //   newTitleSelectedStatus.more = true
      // }else{
      //   // 其他情况都是false
      //   newTitleSelectedStatus[openType] = false
      // }
    this.setState({
      titleSelectedStatus: {...titleSelectedStatus,[openType]:isSelected},
      openType:''
    })
  }
  // 渲染更过筛选条件
  renderFilterMore = () =>{
    const {openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues} = this.state

    if (openType !== 'more') return null
    const data = {roomType, oriented, floor, characteristic}
    const defaultValue = selectedValues.more
    // 可以拿到more默认的选中值
    return (<FilterMore data={data} defaultValue={defaultValue} onOk={this.onOK} onCancel={this.onCancel} />)
  }
  // 渲染遮罩层
  renderMask(){
    const {openType  } = this.state
    // 条件成立隐藏，隐藏就是0
    const isHideMask = openType !== 'area' && openType !== 'mode' && openType !== 'price' 
    
    return ( <Spring to={ {opacity:isHideMask ? 0 : 1} }>
     {props =>{ 
      if(props.opacity === 0 ){ return null }
      return <div style={ props } className={styles.mask} onClick={this.onCancel} /> } }
    </Spring>) 
    
  }
  render() {
    const {titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 ,先隐藏，满足条件才显示*/}
        {this.renderMask()}
        
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onClick={this.changeTitle} titleSelectedStatus={titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
          
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}

          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
