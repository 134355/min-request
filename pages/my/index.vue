<template>
	<view class="content">
		<image class="logo" :src="imgURL"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
		<view>
			<text class="title">{{name}}</text>
		</view>
		<view>
			<text class="title">{{test}}</text>
		</view>
		<button @click="toPage">跳转到首页页面</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'my',
				name: '',
				test: '',
				imgURL: '/static/logo.png'
			}
		},
		onLoad() {
			// 解析路由参数
			console.log(this.$parseURL())

			// 获取缓存的数据
			this.imgURL = this.$cache.get('_imgURL')
			this.name = this.$cache.get('name')
			this.test = this.$cache.get('test')

			console.log(this.$cache.get('delete'))
			console.log(this.$cache.delete('delete'))
			console.log(this.$cache.get('delete'))
		},
		methods: {
			toPage () {
				// 跳到index的页面
				// 不传参数可以简写成如下
				this.$openPage('index')
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
