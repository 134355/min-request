import MinRouter from './MinRouter'

// 配置路由
const router = new MinRouter({
	routes: [
		{
			// 页面路径
      path: 'pages/index/index',
      // type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']
      // 跳转方式(默认跳转方式)
			type: 'navigateTo',
			name: 'index'
		},
		{
			path: 'pages/my/index',
			name: 'my'
		}
	] 
})

export default router
