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
		REQUEST_BASE_URL = `https://self.zhaobg.com`;
		break;

	// 体验版
	case 'trial':
		REQUEST_BASE_URL = `https://self.zhaobg.com`;
		break;

	// 正式版
	case 'release':
		REQUEST_BASE_URL = `https://www.bqshare.com`;
		break;
	default:
		REQUEST_BASE_URL = `https://www.bqshare.com`;
		break;
}

export default { REQUEST_BASE_URL };
