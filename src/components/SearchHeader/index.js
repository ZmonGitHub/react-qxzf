import { Flex } from 'antd-mobile'
import React from 'react'
import {withRouter} from 'react-router-dom'
import styles from './index.module.scss'
import classnames from 'classnames'
function SearchHeader({ history,cityName,className }) {
    return (
        <>
            {/* 顶部搜索栏 */}
            <Flex className={classnames(styles.searchNav,className) }>
                {/* 左边 */}
                <Flex className={styles.searchLeft}>
                    <div onClick={() => history.push('/citylist')}>
                        <span>{cityName}</span>
                        <i className="iconfont icon-arrow"></i>
                    </div>
                    <div className={styles.form}>
                        <i className="iconfont icon-seach"></i>
                        <span className={styles.spanName}>请输入小区或地址</span>
                    </div>
                </Flex>
                <i className="iconfont icon-map" onClick={() => history.push('/map')}>
                </i>
                {/* 右边 */}
            </Flex>
        </>
    )
}

export default withRouter(SearchHeader)