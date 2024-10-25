// 云函数入口文件
//https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/openapi/openapi.html#%E4%BA%91%E8%B0%83%E7%94%A8
// 新项目需要开启云开发，然后在微信开发者工具上传云函数

const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		const result = await cloud.openapi.wxacode.createQRCode({
			path: event.url,
			width: event.width ?? 200,
		});
		return result;
	} catch (err) {
		return err;
	}
};
