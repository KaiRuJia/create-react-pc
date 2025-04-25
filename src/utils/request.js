import axios from 'axios'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 从环境变量中获取接口基础地址
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 用于调试
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果返回的状态码不是 200，判定为一个错误
    if (res.code !== 200) {
      console.log('请求失败: ' + res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // 用于调试
    return Promise.reject(error)
  }
)

export default service