# uni-app网络请求的封装

这几天没事干，就去小程序开发小团队里看看，顺便看了一下代码，在网络请求上发现了一些问题，差点没忍住破口大骂，最终想了想，他们之前没做过，都是第一次就算了（其实是安慰自己而已）。

网络请求都写在page里，每个请求都要重复的写`uni.request`以及一些基础配置，每个页面也要处理相同的异常，这简直就是无脑复制啊。

## 新建一个`MinRequest`类，对`uni.request`进行简单封装

```
class MinRequest {
  // 默认配置
  config = {
    baseURL: '',
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }

  // 判断url是否完整
  static isCompleteURL (url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  // 设置配置
  setConfig (func) {
    this.config = func(this.config)
  }

  // 请求
  request (options = {}) {
    options.baseURL = options.baseURL || this.config.baseURL
    options.dataType = options.dataType || this.config.dataType
    options.url = MinRequest.isCompleteURL(options.url) ? options.url : (options.baseURL + options.url)
    options.data = options.data
    options.header = {...options.header, ...this.config.header}
    options.method = options.method || this.config.method

    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(res)
      }
      options.fail= function (err) {
        reject(err)
      }
      uni.request(options)
    })
  }

  get (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}
```

上面解决了每个请求都要重复的写`uni.request`以及一些基础配置，

## 下面来添加请求拦截器

```
class MinRequest {
  // 默认配置
  config = {
    baseURL: '',
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }

  // 拦截器
  interceptors = {
    request: (func) => {
      if (func) {
        MinRequest.requestBefore = func
      } else {
        MinRequest.requestBefore = (request) => request
      }
      
    },
    response: (func) => {
      if (func) {
        MinRequest.requestAfter = func
      } else {
        MinRequest.requestAfter = (response) => response
      }
    }
  }

  static requestBefore (config) {
    return config
  }

  static requestAfter (response) {
    return response
  }

  // 判断url是否完整
  static isCompleteURL (url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  // 设置配置
  setConfig (func) {
    this.config = func(this.config)
  }

  // 请求
  request (options = {}) {
    options.baseURL = options.baseURL || this.config.baseURL
    options.dataType = options.dataType || this.config.dataType
    options.url = MinRequest.isCompleteURL(options.url) ? options.url : (options.baseURL + options.url)
    options.data = options.data
    options.header = {...options.header, ...this.config.header}
    options.method = options.method || this.config.method

    options = {...options, ...MinRequest.requestBefore(options)}

    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(MinRequest.requestAfter(res))
      }
      options.fail= function (err) {
        reject(MinRequest.requestAfter(err))
      }
      uni.request(options)
    })
  }

  get (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}
```

写到这里就基本完成了就是没有私有属性和私有方法，有些属性和方法是不想暴露出去的，现在要想办法实现这个功能，es6有`Symbol`可以借助这个类型的特性进行私有属性的实现，顺便做成`Vue`的插件

## 完整代码实现

```
const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class MinRequest {
  [config] = {
    baseURL: '',
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }

  interceptors = {
    request: (func) => {
      if (func) {
        MinRequest[requestBefore] = func
      } else {
        MinRequest[requestBefore] = (request) => request
      }
      
    },
    response: (func) => {
      if (func) {
        MinRequest[requestAfter] = func
      } else {
        MinRequest[requestAfter] = (response) => response
      }
    }
  }

  static [requestBefore] (config) {
    return config
  }

  static [requestAfter] (response) {
    return response
  }

  static [isCompleteURL] (url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  setConfig (func) {
    this[config] = func(this[config])
  }

  request (options = {}) {
    options.baseURL = options.baseURL || this[config].baseURL
    options.dataType = options.dataType || this[config].dataType
    options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
    options.data = options.data
    options.header = {...options.header, ...this[config].header}
    options.method = options.method || this[config].method

    options = {...options, ...MinRequest[requestBefore](options)}

    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(MinRequest[requestAfter](res))
      }
      options.fail= function (err) {
        reject(MinRequest[requestAfter](err))
      }
      uni.request(options)
    })
  }

  get (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}

MinRequest.install = function (Vue) {
  Vue.mixin({
    beforeCreate: function () {
			if (this.$options.minRequest) {
        console.log(this.$options.minRequest)
				Vue._minRequest = this.$options.minRequest
			}
    }
  })
  Object.defineProperty(Vue.prototype, '$minApi', {
    get: function () {
			return Vue._minRequest.apis
		}
  })
}

export default MinRequest
```

## 怎么调用呢

创建api.js文件

```
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
  // 这里统一管理api请求
  apis: {
    uniapp (data) {
      return minRequest.get('/s', data)
    }
  }
}
```

在main.js添加

```
import MinRequest from './MinRequest'
import minRequest from './api'

Vue.use(MinRequest)

const app = new Vue({
    ...App,
    minRequest
})
```

在page页面调用

```
methods: {
	// 使用方法一
	testRequest1 () {
		this.$minApi.uniapp({wd: 'uni-app'}).then(res => {
			this.res = res
			console.log(res)
		}).catch(err => {
			console.log(err)
		})
	},

	// 使用方式二
	async testRequest2 () {
		try {
			const res = await this.$minApi.uniapp({wd: 'uni-app'})
			console.log(res)
		} catch (err) {
			console.log(err)
		}
	}
}
```

上面只是实现的简单封装具体调用参考[github](https://github.com/134355/min-request)

# [uni-app缓存器的封装](https://juejin.im/post/5d08a5c2f265da1bb003c0f8)

# [uni-app路由的封装](https://juejin.im/post/5d0314a5f265da1ba77ca05b)