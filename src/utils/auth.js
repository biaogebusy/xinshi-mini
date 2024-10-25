import { getSetting } from '@tarojs/taro';

/**
 * * 获取小程序权限列表
 * @returns Promise
 */
export function getAppSettings() {
	return new Promise((resolve, reject) => {
		getSetting({
			success({ authSetting }) {
				resolve(authSetting);
			},
			fail(err) {
				reject(err);
			},
		});
	});
}
