import { navigateTo, switchTab, showToast } from '@tarojs/taro';
import { useNavigationStore } from '@store/navigation';
const navigationStore = useNavigationStore();

export const isObject = item => {
	return item && typeof item === 'object' && !Array.isArray(item);
};

export const mergeDeep = (target, ...sources) => {
	if (!sources.length) return target;
	const source = sources.shift();
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key])
					Object.assign(target, {
						[key]: source[key],
					});
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, {
					[key]: source[key],
				});
			}
		}
	}
	return mergeDeep(target, ...sources);
};

export const gotoPage = link => {
	if (link.startsWith('page=')) {
		const page = link.split('=')[1];
		navigateTo({
			url: page,
		});
		return;
	}
	if (link.startsWith('tab=')) {
		const tabName = link.split('=')[1];
		navigationStore.SET_TAB_BAR_ACTIVE(tabName);
		switchTab({
			url: tabName,
		});
		return;
	}

	if (link.indexOf('toast=') > 0) {
		const toast = link.split('toast=')[1];
		showToast({
			icon: 'none',
			title: toast,
		});
		return;
	}
	if (link.startsWith('pages/page')) {
		navigateTo({
			url: `/${link}`,
		});
		return;
	}
	navigateTo({
		url: `/pages/page?url=${link}`,
	});
};

export const checkWxUpdate = () => {
	const updateManager = wx.getUpdateManager();

	updateManager.onCheckForUpdate(function(res) {
		// 请求完新版本信息的回调
		// console.log(res.hasUpdate);
	});

	updateManager.onUpdateReady(function() {
		wx.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success: function(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			},
		});
	});
};

export const getParameFromURL = (url, paramName) => {
	const paramPairs = url.split('?')[1].split('&');
	for (const pair of paramPairs) {
		const [key, value] = pair.split('=');
		if (key === paramName) {
			return value;
		}
	}
	return null;
};

// 将对象转换成查询字符串
export const toQueryString = obj => {
	return Object.keys(obj)
		.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
		.join('&');
};

export const buildUrlString = params => {
	const { url, ...restParams } = params;
	if (url === undefined) {
		throw new Error("参数中必须包含 'url' 属性");
	}
	const queryString = Object.entries(restParams)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
		)
		.join('&');
	return queryString ? `${url}&${queryString}` : url;
};
