import {
	getLocation,
	showLoading,
	hideLoading,
	getSetting,
	authorize,
} from '@tarojs/taro';
import { useUserStore } from '@store/user';
var QQMapWX = require('@utils/qqmap-wx-jssdk.min.js');

/**
 * * 获取用户地理位置
 * @returns location:(gcj02坐标) { longitude, latitude }
 */
export function getUserLocation(save) {
	const userStore = useUserStore();
	const currentAddress = computed(() => userStore.address);
	return new Promise(async (resolve, reject) => {
		showLoading();

		const { 'scope.userLocation': userLocation = false } =
			await getAppSettings();

		if (userLocation) {
			getLocation({
				type: 'gcj02',
			})
				.then(({ latitude, longitude }) => {
					hideLoading();
					resolve({ latitude, longitude });
					if (!currentAddress.value || save) {
						userStore.setUserLocation({ latitude, longitude });
					}
				})
				.catch((err) => {
					hideLoading();
					reject(err);
					console.log(err);
				});
		} else {
			authorize({
				scope: 'scope.userLocation',
				success() {
					getLocation({
						type: 'gcj02',
					})
						.then(({ latitude, longitude }) => {
							hideLoading();
							resolve({ latitude, longitude });
							if (save) {
								userStore.setUserLocation({ latitude, longitude });
							}
						})
						.catch((err) => {
							hideLoading();
							reject(err);
							console.log(err);
						});
				},
				fail(err) {
					reject(err);
					hideLoading();
				},
			});
		}
	});
}

export function getUserAddress({ key, latitude, longitude }) {
	return new Promise((resolve, reject) => {
		const map = new QQMapWX({
			key: key,
		});
		map.reverseGeocoder({
			location: {
				latitude: latitude,
				longitude: longitude,
			},
			get_poi: 1,
			poi_options: 'address_format=short;radius=5000;policy=2',
			success: ({ result }) => {
				resolve(result);
			},
			fail: (error) => {
				console.log(error);
				reject(error);
			},
		});
	});
}

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
