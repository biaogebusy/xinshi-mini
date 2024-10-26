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
		'pages/blog',
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
			// tabs 固定必须要的页面配置
			{
				pagePath: 'pages/user',
			},
			{
				pagePath: 'pages/home',
			},
			{
				pagePath: 'pages/blog',
			},
		],
	},
	permission: {
		'scope.userLocation': {
			desc: '你的位置信息将用于获取地图应用',
		},
	},
	requiredPrivateInfos: [],
});
