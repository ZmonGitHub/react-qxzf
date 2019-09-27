import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'
import classnames from 'classnames'
// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle({onClick,titleSelectedStatus}) {
  // titleSelectedStatus是一个数组
  return (
    <Flex align="center" className={styles.root} >
      {
        titleList.map( item => {
          // 可以拿到当前点击的title的type让其高亮
          const isSelected = titleSelectedStatus[item.type]
          return (
            <Flex.Item key={item.type} onClick={ () => onClick(item.type) }>
              {/* 选中类名： styles.selected */}
              <span className={classnames(styles.dropdown,{[styles.selected]:isSelected})}>
                <span> {item.title} </span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          )
        } )
      }
    </Flex>
  )
}
