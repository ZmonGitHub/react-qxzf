const CITY_KEY = 'hkzf_city'

// 获取当前城市定位
const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))
// 设置当前城市定位
const setCity = (label,value) => JSON.stringify(localStorage.setItem(CITY_KEY,{label,value}))

export { getCity,setCity }