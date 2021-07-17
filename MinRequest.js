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

	static[requestBefore](config) {
		return config
	}

	static[requestAfter](response) {
		return response
	}

	static[isCompleteURL](url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	setConfig(func) {
		this[config] = func(this[config])
	}

	request(options = {}) {
		options.baseURL = options.baseURL || this[config].baseURL
		options.dataType = options.dataType || this[config].dataType
		options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
		options.data = options.data
		options.header = {
			...options.header,
			...this[config].header
		}
		options.method = options.method || this[config].method

		options = {
			...options,
			...MinRequest[requestBefore](options)
		}

		return new Promise((resolve, reject) => {
			options.success = function(res) {
				resolve(MinRequest[requestAfter](res))
			}
			options.fail = function(err) {
				reject(MinRequest[requestAfter](err))
			}
			// console.log("发送请求的参数",options)
			uni.request(options)
		})
	}

	get(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	}

	post(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}

	put(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	}

	delete(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}

const minRequest = new MinRequest()

MinRequest.install = function(Vue) {
	Vue.mixin({
		beforeCreate: function() {
			if (this.$options.minRequest) {
				// 安装的api
				Vue._minRequest = this.$options.minRequest
			}
		}
	})
	Object.defineProperty(Vue.prototype, '$ab', { // 改成你喜欢的任何名称
		get: function() {
			return Vue._minRequest.apis
		}
	})
	Vue.prototype.$get = function(url, data) {
		return minRequest.get(url, data)
	}
	Vue.prototype.$post = function(url, data) {
		return minRequest.post(url, data)
	}
	Vue.prototype.$delete = function(url, data) {
		return minRequest.delete(url, data)
	}
	Vue.prototype.$put = function(url, data) {
		return minRequest.put(url, data)
	}


}
export default MinRequest
