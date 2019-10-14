import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'
import {API} from '../../../utils'
import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    console.log('props的location中的state会有传递的数据,是h5的location方法',props.location)
    const community = {
      name: '',
      id: ''
    }
    // 如果拿到了数据，就存过来
    const {state} = this.props.location
    if (state) {
      // 不是对象不要写逗号。乱加符号。。。
    community.name = state.name
    community.id = state.id
    }
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }
  // 封装一个可以复用的获取值的函数
  getValue = (name,value) => {
    this.setState({
      // name当前状态名，value当前输入值或选中值
      [name]:value
    })
  }
  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }
  handleHousePackage = (selectedValues) => {
    // console.log(selectedValues)
    //拿到了点击的获取到的配套name
    this.setState({
      supporting:selectedValues.join('|')
    })
    // console.log(this.state.supporting)
  }
  handleImg = (files, type, index) => {
    // console.log(files, type, index)
    this.setState({
      tempSlides:files
    })
  }

  addHouse = async () => {
    // 1 先实现图片上传
    const {tempSlides} = this.state
    if( tempSlides.length < 1 ) return Toast.info('请上传房屋图片',1)
    const form = new FormData()
    tempSlides.forEach(item => {
      form.append('file',item.file)
    })
    // 调用图片上传接口
    const res = await API.post('/houses/image',form,{
      // 因为现在上传的数据为 复杂的数据（图片文件），不再是简单的字符串数据
      headers:{
        'Content-Type':'multipart/form-data'
      }
    })
    // console.log(res)
    const {body} = res.data
    const houseImg = body.join('|')
    // 房源发布
    const {
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      supporting,
      description,
      community
    } = this.state
    const getAddHouse = await API.post('/user/houses',{
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      supporting,
      description,
      community:community.id,
      houseImg
    })
    console.log(getAddHouse)
    if(getAddHouse.data.status === 200){
      Toast.info('发布成功',1,()=>{
        this.props.history.push('/rent')
      })
    }else if(getAddHouse.data.status === 400){
      // 登录超时，跳转重新登录
      this.props.history.replace('/login',this.props.location)
    }else{
      Toast.info('服务器偷懒了，请稍后再试~')
    }
  }
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size,
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" onChange={ (value)=> this.getValue('price',value)} value={price}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" value={size} onChange={ (value) => this.getValue('size',value)}  extra="㎡">
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} onChange={ (value)=> this.getValue('roomType',value[0]) } cols={1}>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} onChange={ (value)=>this.getValue('floor',value[0]) } cols={1}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} onChange={ (value)=>this.getValue('oriented',value[0]) } cols={1}>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={ (value)=> this.getValue('title',value) }
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            onChange={this.handleImg}
            className={styles.imgpicker}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select onSelect={ this.handleHousePackage }  />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={ (value)=> this.getValue('description',value) }
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
