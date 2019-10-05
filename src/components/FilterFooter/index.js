import React from 'react'

import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'

import styles from './index.module.css'

function FilterFooter({
  cancelText ,
  okText,
  onCancel,
  onOk,
  className,
  style
}) {
  return (
    <Flex style={style} className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        // 这个按钮就是取消按钮，事件是从filter一层一层传过来的
        onClick={onCancel}
      >
        {cancelText}
      </span>

      {/* 确定按钮 */}
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </Flex>
  )
}
// 默认属性
FilterFooter.defaultProps = {
  cancelText: '取消',
  okText: '确定'
}
// props校验
FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
}

export default FilterFooter
