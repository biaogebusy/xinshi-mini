/**
 * * 请求相关配置
 */
const {
	miniProgram: { envVersion },
} = wx.getAccountInfoSync();

export let REQUEST_BASE_URL = '';
switch (envVersion) {
	// 开发版
	case 'develop':
		REQUEST_BASE_URL = `https://builder.design`;
		break;

	// 体验版
	case 'trial':
		REQUEST_BASE_URL = `https://builder.design`;
		break;

	// 正式版
	case 'release':
		REQUEST_BASE_URL = `https://builder.design`;
		break;
	default:
		REQUEST_BASE_URL = `https://builder.design`;
		break;
}

export default { REQUEST_BASE_URL };
