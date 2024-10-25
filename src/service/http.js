// 对请求进行封装
import {
	request,
	getStorageSync,
	uploadFile,
	getSystemInfoSync,
} from '@tarojs/taro';
import { REQUEST_BASE_URL } from '@utils/config';
import { mergeDeep } from '@utils/index';
const cache = new Map();

/**
 * * 请求统一封装处理
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export default function http(url, options = {}) {
	return new Promise((resolve, reject) => {
		const defaultOptions = {
			header: {
				cookie: getStorageSync('sessionid'),
				'X-CSRF-Token': getStorageSync('csrf_token'),
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const sysInfo = getSystemInfoSync();
		const params = [];
		let urlParams = '';
		// Add api params
		if (sysInfo.platform === 'devtools') {
			if (!url.includes('noCache')) {
				params.push('noCache=1');
			}
		}
		const apiParams = params.join('&');
		const apiPath = `${REQUEST_BASE_URL}${url}`;
		if (apiPath.includes('?')) {
			urlParams = apiParams ? `&${params}` : '';
		} else {
			urlParams = apiParams ? `?${params}` : '';
		}
		const key = `${apiPath}${urlParams}`;
		if (options.cache && cache.has(key)) {
			resolve(cache.get(key));
			return;
		}
		request({
			url: `${apiPath}${urlParams}`,
			success(res) {
				if ([200, 201, 204].includes(res.statusCode)) {
					resolve(res);
					if (options.cache) {
						cache.set(key, res);
					}
				} else {
					reject(res);
				}
			},
			fail(err) {
				reject(err);
			},
			...mergeDeep({}, defaultOptions, options),
		});
	});
}

/**
 * * GET 请求封装
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export function GET(url, options = {}) {
	return http(url, options);
}

/**
 * * POST 请求封装
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export function POST(url, options = {}) {
	const method = 'POST';
	return http(url, { method, ...options });
}

/**
 * * PATCH 请求封装
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export function PATCH(url, options = {}) {
	const method = 'PATCH';

	return http(url, { method, ...options });
}

/**
 * * DELETE 请求封装
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export function DELETE(url, options = {}) {
	const method = 'DELETE';
	return http(url, { method, ...options });
}

/**
 * * UPLOAD 请求封装
 * ! TODO: 完善请求
 *
 * @param {String} url 请求的 url
 * @param {Object} options 请求配置
 * @returns Promise 对象
 */
export function UPLOAD(url, options = {}) {
	const defaultOptions = {
		header: {
			cookie: getStorageSync('sessionid'),
			'X-CSRF-Token': getStorageSync('csrf_token'),
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	return uploadFile({
		url: REQUEST_BASE_URL + url,
		method: 'POST',
		...defaultOptions,
		...options,
	});
}
