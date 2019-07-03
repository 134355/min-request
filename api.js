import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
  return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
  config.baseURL = 'https://www.baidu.com'
  return config
})


export default {
  apis: {
    uniapp (data) {
      return minRequest.get('/s', data)
    }
  }
}
