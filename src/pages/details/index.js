import React, { Component } from 'react'

import { Carousel, Flex,Modal,Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { BASE_URL,API,isAuth } from '../../utils'

import styles from './index.module.scss'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}
// const isFavorite = false
export default class HouseDetail extends Component {
  state = {
    isFavorite:false,
    imgHeight:252,
    isLoading: false,
    body:{},
    houseInfo: {
      // 房屋图片
      slides: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  componentDidMount() {
  const {id} = this.props.match.params
  this.id = id
  this.renderHouses()
  this.checkFavorite()
  }
  // 进入页面就执行，判断是否登录，来执行收藏操作
  async checkFavorite() {
  if(!isAuth()){
    // 没有登录去登录
    return
  }
  // 登录就去发送ajax,查看收藏状态
  const res = await API.get(`/user/favorites/${this.id}`)
  // console.log(res)
  const { body,status } = res.data
  if(status === 200){
    this.setState({
      isFavorite: body.isFavorite
    })
  }
  }
  // 渲染详情页
  async renderHouses(){
   // console.log(this.props.match.params)

   // 开启loading
   this.setState({
    isLoading: true
  })
   const res = await API.get(`/houses/${this.id}`)
   // console.log(res)
   const { data:{body} } = res
   this.body = body
   this.setState({
     houseInfo:{
       slides:body.houseImg,
       price:body.price
     },
     body,
     isLoading:false
   })
  //  console.log(this.state.slides)
   this.renderMap(body.community, {
     latitude: body.coord.latitude,
     longitude: body.coord.longitude
   })
  }
  showModal () {
    Modal.alert('提示','登录后才能收藏房源，是否去登录?',[
      {text:'取消'},
      {text:'去登录',onPress: () => {
        // 点击后去Login页面,因为跳转登录后，还需要存储当前页的地址，登录后返回
        this.props.history.replace('/login',this.props.location)
      }}
    ])
  }
  // 收藏点击事件
  handelFavorite = async() =>{
    // 先判断有没有登录
    if(!isAuth()){
      this.setState({
        isFavorite: false
      })
      //1 如果没有登录，就提示用户： 需要登录
      return this.showModal()
    }
    // 如果登录了，获取当前收藏状态
    const { isFavorite } = this.state
      // 进行判断
      if(isFavorite){
        const res = await API.delete(`/user/favorites/${this.id}`)
        // console.log(res)
        //  2.1 如果已收藏，就ajax删除收藏
        this.setState({
          isFavorite:false
        })
        if(res.data.status === 200 ){
          // 提示已经取消，显示1.5秒
          Toast.info('已取消收藏',1.5)
        }else{
          // 就是返回400+的，就是token实效等特殊情况，让用户登录
          this.showModal()
        }
      }else{
        //  没有ajax收藏就收藏
        const res = await API.post(`/user/favorites/${this.id}`)
        if(res.data.status === 200){
          // 提示收藏成，更新state状态
          Toast.info('收藏成功',1.5)
          this.setState({
            isFavorite:true
          })
        }else{
          // 超时就重新登
          this.showModal()
        }
      }

  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { slides }
    } = this.state
    // sllides是空数组
    // console.log(slides)

    return slides.map(item => (
      <a key={item}  href="http://itcast.cn" style={{ display: 'inline-block', width: '100%', height:252}} >
        <img
          src={BASE_URL + item}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' ,height:252 }}
          // 如果不加下面这个设置就会只显示100px的高度
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
        }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

  render() {
    const { isLoading,body,isFavorite } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={<i className="iconfont icon-share" />}
        >
          {body.community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000} >
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            整租 · 精装修，拎包入住，配套齐Q，价格优惠
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              <span className={[styles.tag, styles.tag1].join(' ')}>
                随时看房
              </span>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {body.price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div> {body.roomType} </div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div> {body.size} 平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                低楼层
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>南
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>天山星城</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          <HousePackage
            list={[
              '电视',
              '冰箱',
              '洗衣机',
              '空调',
              '热水器',
              '沙发',
              '衣柜',
              '天然气'
            ]}
          />
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {/* {description || '暂无房屋描述'} */}
              1.周边配套齐全，地铁四号线陶然亭站，交通便利，公交云集，距离北京南站、西站都很近距离。
              2.小区规模大，配套全年，幼儿园，体育场，游泳馆，养老院，小学。
              3.人车分流，环境优美。
              4.精装两居室，居家生活方便，还有一个小书房，看房随时联系。
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} onClick={a => a} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handelFavorite} >
            { isFavorite ? (<>
            <img
              src={BASE_URL + '/img/star.png'}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>已收藏</span>
            </>) : 
            (<>
              <img
                src={BASE_URL + '/img/unstar.png'}
                className={styles.favoriteImg}
                alt="收藏"
              />
              <span className={styles.favorite}>收藏</span>
              </>)
          }
            
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
