import { GET, POST, PATCH } from '../http';
import { getStorageSync } from '@tarojs/taro';
import {
	useShareAppMessage,
	useShareTimeline,
	getCurrentPages,
} from '@tarojs/taro';
import { useNavigationStore } from '@store/navigation';

/**
 * * 获取着陆页配置
 *
 * @param {String} url 着陆页地址
 * @returns GET 请求
 */
function loadLandingPage(url) {
	return GET(`/api/v3/landingPage?content=${url}`, { cache: true });
}

/**
 * * 获取全局配置
 *
 * @returns GET 请求
 */
function loadBaseConfig() {
	return GET(`/api/v3/landingPage?content=/core/mini`, { cache: true });
}

/**
 * * 访问统计
 *
 * @param {String} node id
 * @returns POST 请求
 */
function statistics(id) {
	return POST(`/api/v3/statistics/node/${id}`);
}

function shareWX() {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const navigationStore = useNavigationStore();

	// 分享好友
	useShareAppMessage(({ from, target }) => {
		// console.log(`ShareAppMessage from: ${from}`);
		// console.log(`ShareAppMessage target: ${target}`);
		if (from === 'button') {
			// 来自页面内转发按钮
			console.log(target);
		}

		wx.reportEvent('share', {
			url: navigationStore.title,
			title: currentPage.$taroPath,
		});

		return {
			title: navigationStore.title,
			path: currentPage.$taroPath,
		};
	});

	// 分享朋友圈
	useShareTimeline(({ from, target }) => {
		// console.log(`ShareTimeline from: ${from}`);
		// console.log(`ShareTimeline target: ${target}`);
		if (from === 'button') {
			// 来自页面内转发按钮
			console.log(target);
		}

		wx.reportEvent('share', {
			url: navigationStore.title,
			title: currentPage.$taroPath,
		});

		return {
			title: navigationStore.title,
			path: currentPage.$taroPath,
		};
	});
}

function updateAttributes({ api, uuid, type, attr, relationships }) {
	return PATCH(`${api}/${uuid}`, {
		header: {
			cookie: getStorageSync('sessionid'),
			'X-CSRF-Token': getStorageSync('csrf_token'),
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
		},
		data: {
			data: {
				type,
				id: uuid,
				attributes: {
					...attr,
				},
				relationships: {
					...relationships,
				},
			},
		},
	});
}

function addNode({ api, type, attr, relationships }) {
	const relate = {};
	if (relationships) {
		relate = {
			relationships: {
				...relationships,
			},
		};
	}
	return POST(api, {
		header: {
			cookie: getStorageSync('sessionid'),
			'X-CSRF-Token': getStorageSync('csrf_token'),
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
		},
		data: {
			data: {
				type,
				attributes: {
					...attr,
				},
				...relate,
			},
		},
	});
}

//  * export
export {
	loadLandingPage,
	statistics,
	loadBaseConfig,
	shareWX,
	updateAttributes,
	addNode,
};
