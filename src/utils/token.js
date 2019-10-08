//登录状态的键
const TOKEN_KEY = 'hkzf_token'

// 存储TOKEN
const setToken = token => localStorage.setItem(TOKEN_KEY,token)

// 获取到TOKEN
const getToken = () => localStorage.getItem(TOKEN_KEY)

// 删除TOKEN
const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// 判断是否登录,双感叹号转布尔值
const isAuth = () => !!getToken()

export {setToken,getToken,removeToken,isAuth}