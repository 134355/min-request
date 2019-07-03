import Vue from 'vue'
import App from './App'

// 引入MinRouter文件
import MinRouter from './MinRouter'
// 引入router文件
import minRouter from './router'
import mina from './components/min-a.vue'
import MinCache from './MinCache'
import MinRequest from './MinRequest'
import minRequest from './api'

Vue.config.productionTip = false

// 注册路由
Vue.use(MinRouter)
// 注册缓存器
Vue.use(MinCache)
// 设置默认缓存时间
// Vue.use(MinCache, {timeout: 600})

// 注册请求
Vue.use(MinRequest)

Vue.component('min-a', mina)

App.mpType = 'app'

const app = new Vue({
    ...App,
    minRouter,
    minRequest
})
app.$mount()
