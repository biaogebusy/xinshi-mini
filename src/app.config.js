// * App全局配置
// pages 只保留tab必有的页面，其他页面langding Page构建
export default defineAppConfig({
	usingComponents: {
		wxParse: './components/wxParse/wxParse',
	},
	pages: [
		'pages/home',
		'pages/user',
		'pages/user/binding',
		'pages/user/register',
		'pages/page',
	],
	window: {
		navigationStyle: 'custom',
		backgroundTextStyle: 'dark',
		navigationBarBackgroundColor: '#26dc89',
		navigationBarTitleText: '信使',
		navigationBarTextStyle: 'white',
	},
	tabBar: {
		custom: true,
		selectedColor: '#009b64',
		color: '#b2b2b2',
		backgroundColor: '#f3f4f6',
		borderStyle: 'white',
		list: [
			{
				pagePath: 'pages/user',
				text: '个人中心',
				iconPath: 'assets/images/tabbar/profile.png',
				selectedIconPath: 'assets/images/tabbar/profile-active.png',
			},
			{
				pagePath: 'pages/home',
				text: '首页',
				iconPath: 'assets/images/tabbar/gift.png',
				selectedIconPath: 'assets/images/tabbar/gift-active.png',
			},
		],
	},
	permission: {},
	requiredPrivateInfos: [],
});
