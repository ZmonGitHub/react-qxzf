import axios from 'axios'
import {API}  from './api'
import {BASE_URL} from './url'
const BMap = window.BMap
const getCurrentCity = () => {

    const curCity = JSON.parse(localStorage.getItem('hkzf_city'))
    // 根据判断条件返回合适的数据！！
    if(!curCity){

        return new Promise( resolve =>{
    // 为了让组件可以拿到异步函数的数据，使用promise 来传递
        const myCity = new BMap.LocalCity()
        myCity.get( async result => {
            // console.log(result)
            // 通过百度地图中提供的 IP定位 来获取当前城市信息
            const res = await axios.get('http://localhost:8080/area/info',{
                params:{
                    name:result.name
                }
            })
            const { label,value } = res.data.body
            // console.log(label,value)
            resolve({label,value})
            // 存要存字符串
            localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
        } )}

        )}
    else{
        // 如果有 就直接用
        // 注意：在封装函数的时候，需要保证函数内部的一致性。在此处指的就是函数的返回值，我们应该保证这个函数
        //      不管什么情况下，返回值的类型一定要保持一致！！！
        //      因为 if 中为了获取异步的结果，返回了一个 Promise。那么，else 也应该返回一个 Promise。 这样，就保证了
        //      函数返回值的一致性
        // return new Promise(resolve => {
        //   // console.log('直接返回本地缓存中的数据：', curCity)
        //   resolve(curCity)
        // })
        // 简化语法：
        return Promise.resolve(curCity)
        // Promise是一个构造函数需要大写
    }

 }



export {getCurrentCity,API,BASE_URL}