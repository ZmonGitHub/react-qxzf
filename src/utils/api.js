import axios from 'axios'
import{ BASE_URL } from './url'
import {getToken,removeToken} from './token'
const API =axios.create({
    baseURL:BASE_URL
})

// 添加请求拦截器
API.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const {url} = config
    // 只要以/user开头，并且不是注册和登录页面都不需要添加请求头
    if(url.startsWith('/user')
    && !url.startsWith('/user/registered')&& !url.startsWith('/user/login')
    ){
    config.headers.authorization = getToken()
    }
    // console.log(config)
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器,这样的好处就是不用在页面中写了。这个地方可以全部页面同一处理
API.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    if(response.data.status !== 200){
        removeToken()
    }
    // 如果状态码是400或者异常直接移出token
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export {API}