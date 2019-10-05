import React, { Component } from 'react'
import styles from './index.module.scss'
// 组件必须加上数据格式检测
import PropTypes from 'prop-types'
class Sticky extends Component {
    // 占位符REF对象
    placeholderRef = React.createRef()
    // 内容REF对象
    contentRef = React.createRef()
    // 创建事件监听
    componentDidMount(){
        window.addEventListener('scroll',this.handelScroll)
    }
    // 解绑事件监听
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handelScroll)
    }
    handelScroll = () =>{
        const placeholderEl = this.placeholderRef.current
        const contentEl = this.contentRef.current
        // 获取到DOM对象
        const { top } = placeholderEl.getBoundingClientRect()
        // console.log('事件监听触发',top)
        // 占位符对象跟视口顶部的距离为45.大于0是需要显示，小于是需要隐藏
        const {height} = this.props
        if( top <= 0 ){
            // 给内容添加固定定位类。
            contentEl.classList.add(styles.fixed)
            // 让占位符有高度可以撑起顶部，保持平滑过渡
            placeholderEl.style.height = `${height}px`
        }else{
            // 反之去掉固定定位，并让height为0
            contentEl.classList.remove(styles.fixed)
            placeholderEl.style.height = '0px'

        }
    }
    render() {
        return (
            <>
                {/* stycky */}
                {/* 占位符 */}
                <div ref={this.placeholderRef} ></div>
                {/* 内容 */}
                <div ref={this.contentRef} > { this.props.children } </div>
                {/* 不加children就没有办法显示标签中嵌套额组件 */}
            </>
        )
    }
}
// 属性校验，prop首字母小写
Sticky.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}
export default Sticky