import React from 'react'
import { Flex, WingBlank, WhiteSpace,Toast } from 'antd-mobile'
// 引入表单高阶组件进行优化
import { withFormik,Form,Field,ErrorMessage } from 'formik'
// 引入Yup组件表单校验
import * as Yup from 'yup'; // for everything
import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'
import {API} from '../../utils'
import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
// 没有状态更新，可以用函数组件
let Login = () => {
    // const { username,password } = this.state
    // console.log('表单提交了')
    // value表示元素的值，handelSubmit表单提交事件，handleChange表示处理表单元素的事件，高阶组件提供,都在props中
    // console.log(errors,touched)
    // errors用来显示表单输入错误提示,touched需要handleBlur配合使用
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form >
            <div className={styles.formItem}>
              {/* <input
                
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
              <Field className={styles.input}
                name="username"
                placeholder="请输入账号"></Field>
            </div>
            {/* {errors.username && touched.username && <div className={styles.error}>{errors.username}</div>} */}
            <ErrorMessage component="div" className={styles.error} name="username" />
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              {/* <input
                
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
              <Field className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"></Field>
            </div>
            {/* {errors.password && touched.password && <div className={styles.error}>{errors.password}</div>} */}
            <ErrorMessage component="div" className={styles.error} name="password" />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }

// 组件帮助优化表单，如submit默认行为
Login =  withFormik({
   // 该配置用来为组件提供状态，相当于原来组件的 state 的作用
  mapPropsToValues: () => ({ username: '',password:'' }),
  // values表单元素值对象
  handleSubmit:async (values, { props }) => {
    // 第二个属性是一个对象，对象中有Props
    const {username,password} = values
    const res = await API.post('/user/login',{
      username,password
    })
    // console.log(res)
    const { body,status,description } = res.data
    if(status === 200){
    localStorage.setItem('hkzf_token',body.token)
    props.history.go(-1)
    }else{
      Toast.info(description,2)
    }
  },
  // 表单校验配置项
  validationSchema:Yup.object().shape({
    // matches是正则表达式的方法,第一个参数是一个正则表达式，第二个参数是不满足条件时显示的内容
    username: Yup.string().required('请输入用户名').matches(REG_UNAME,'用户名长度5到8位'),
    password: Yup.string().required('请输入密码').matches(REG_PWD,'密码长度5到12位')
  })
})(Login)
export default Login
