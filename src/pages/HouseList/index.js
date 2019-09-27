import React from 'react'
import { Flex } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from './components/Filter'
const {label} = JSON.parse(localStorage.getItem('hkzf_city'))
export default function HouseList() {
    return (
        <div >
            <Flex className={styles.headerNav}>
            {/* 这个是顶部的导航栏 */}
            <i className="iconfont icon-back"></i>
            <SearchHeader cityName={label}></SearchHeader>
            </Flex>
            {/* 条件筛选栏 */}
            <Filter />
            
        </div>
    )
}
