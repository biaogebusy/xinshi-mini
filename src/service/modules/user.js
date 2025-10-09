/**
 * !! 用户相关接口
 */
import {
	showToast,
	showModal,
	showLoading,
	hideLoading,
	getStorageSync,
	login,
	checkSession,
} from '@tarojs/taro';
import { REQUEST_BASE_URL } from '@utils/config';
import { useUserStore } from '@store/user';
import { GET, PATCH, POST } from '../http';
import { computed } from 'vue';
import { useNavigationStore } from '@store/navigation';
import { intersection, isArray } from 'lodash-es';
import { gotoPage } from '@utils/index';

const userStore = useUserStore();
const navigationStore = useNavigationStore();

export function checkRoleShow(link) {
	if (
		!link.params ||
		!link.params.reqRoles ||
		link.params.reqRoles.length === 0
	) {
		return true;
	} else {
		const profile = computed(() => userStore.profile);
		if (!profile.value) {
			return false;
		}

		if (profile.value.roles.administrator) {
			return true;
		}

		const currentUserRoles = Object.keys(profile.value.roles);
		return intersection(currentUserRoles, link.params.reqRoles).length > 0;
	}
}

/**
 *
 * @param {Object} param0
 * @returns Promise
 */
export function loginOrRegisterByPhone({ mobile, code }) {
	return POST(`/api/v1/otp/login?_format=json`, {
		data: {
			mobile_number: mobile,
			code: code,
		},
	});
}

/**
 * * 登录微信
 * @returns Promise 登录结果
 */
export function appLogin() {
	return new Promise((resolve, reject) => {
		login({
			success(res) {
				if (res.code) {
					resolve(res);
				} else {
					reject(res);
				}
			},
		});
	});
}

/**
 * * 检查微信登录态是否过期
 * @returns Promise 登录状态
 */
export function checkWechatLogin() {
	return new Promise((resolve, reject) => {
		checkSession({
			success(res) {
				if (res.errMsg && res.errMsg === 'checkSession:ok') {
					resolve(true);
				} else {
					reject(false);
				}
			},
			fail(err) {
				resolve(false);
			},
		});
	});
}

/**
 * * 通过微信用户绑定注册用户
 * @param {Object} code 微信code
 * @param {Object} user 用户名
 * @param {Object} pass 密码
 * @returns Promise 请求结果
 */
export function wechatUserBindDrupalUser({ code, user = '', pass = '' }) {
	return POST('/api/v1/miniprogram/register?_format=json', {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: {
			// * 微信 code
			code,
			// * 用户名
			user,
			// * 密码
			pass,
		},
	});
}

/**
 * * 微信绑定手机注册用户
 * @param {Object} data 接口参数
 * @returns Promise 请求结果
 */
export function wechatBindDrupalPhoneUser({
	code,
	verification_code,
	mobile_number,
}) {
	return POST('/api/v1/miniprogram/bind-register', {
		data: {
			// * 微信code
			code,
			// * 手机验证码
			verification_code,
			// * 手机号码
			mobile_number,
		},
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
}

/**
 * * 微信用户登录后台
 * @param {Object} code code
 * @returns Promise 请求结果
 */
export function LoginDrupal({ code }) {
	return POST('/api/v1/miniprogram/login?_format=json', {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: {
			code,
		},
	});
}

/**
 * * 校验后台用户登录
 * @returns Promise 后台登录状态
 */
export function getDrupalUserState() {
	return GET('/user/login_status?_format=json&noCache=1');
}

/**
 * * 获取后台用户信息
 * @returns Promise 后台用户信息
 */
export function getDrupalProfile() {
	return GET('/api/v3/personalProfile?noCache=1');
}

/**
 * * 获取手机验证码
 * @param {Object} mobile_number mobile_number
 * @returns Promise 获取手机验证码结果
 */
export function getPhoneCaptcha({ mobile_number }) {
	return POST('/api/v1/otp/generate?_format=json', {
		data: {
			// * 是否自动注册
			auto_register: true,
			// * 手机号码
			mobile_number,
		},
	});
}

/**
 * ! 登录流程
 * @returns Promise 登录结果
 */
export async function auth() {
	try {
		// 缓存数据
		const sessionid = getStorageSync('sessionid');
		const token = getStorageSync('csrf_token');
		let profile = getStorageSync('profile');
		let isWechatLogin = false;
		let isDrupalLogin = false;
		let appCode = null;
		isWechatLogin = await checkWechatLogin();
		console.log(`isWechatLogin: ${isWechatLogin}`);
		showLoading();
		// 登录过期或者本地缓存过期，重新登陆
		if (!isWechatLogin || !profile || !sessionid || !token) {
			// 微信登录并获取到code
			const { errMsg, code } = await appLogin();

			if (!code) {
				// ! 登录失败
				showToast({
					icon: 'none',
					title: `微信登录授权失败：${errMsg}`,
				});
				throw new Error(`微信登录授权失败：${errMsg}`);
			} else {
				// * 登陆成功
				appCode = code;
			}
		}

		// * 校验Drupal用户登录状态
		const { data: adminLoginData } = await getDrupalUserState();
		isDrupalLogin = adminLoginData === 1;

		// * 未登录后台或者本地登录信息已过期
		if (!isDrupalLogin || !sessionid || !token) {
			// * 使用微信个人信息登录后台
			const {
				header,
				data: { csrf_token, errCode, errMsg },
			} = await LoginDrupal({
				code: appCode,
				// ...profile,
			});

			// 新注册用户流程，执行自动注册新账号，并保存用户状态
			if (errCode === 49005) {
				// * code 需要刷新
				const { errMsg: refreshErrMsg, code: refreshCode } = await appLogin();
				if (refreshCode) {
					const {
						header,
						data: { csrf_token, errCode, errMsg },
					} = await wechatUserBindDrupalUser({ code: refreshCode });

					if (errCode === 0) {
						// * 绑定成功
						setUserProfile({
							sessionid: header['Set-Cookie'],
							token: csrf_token,
						});
						console.log(`${errCode}: 新用户流程`);
						hideLoading();
						return;
					} else {
						// 登录后保存状态
						setUserProfile({
							sessionid: header['Set-Cookie'],
							token: csrf_token,
						});
						console.log(`${errCode}: 新用户流程`);
						hideLoading();
						return;
					}
				} else {
					// ! 绑定失败
					showToast({
						icon: 'none',
						title: `登录失败：${refreshErrMsg}`,
					});
					throw new Error(refreshErrMsg);
				}
			}

			// * 微信登陆其他问题
			if (errCode !== 0) {
				showToast({
					icon: 'none',
					title: `登录失败：${errMsg}`,
				});
				throw new Error(errMsg);
			}
			// Toast.fail(String(error));
			console.log(`${errCode}: 已注册用户流程`);
			// 已注册用户流程
			// * 微信登陆成功并保存用户状态
			setUserProfile({
				sessionid: header['Set-Cookie'],
				token: csrf_token,
			});
			console.log(`isDrupalLogin: ${isDrupalLogin}`);
			hideLoading();
		}
	} catch (error) {
		showToast({
			icon: 'none',
			title: error,
		});
		hideLoading();
		console.log(error);
	}
}

/**
 *	* 缓存后台登录信息
 * @param {String} sessionid
 * @param {String} token
 * @param {Object} profile
 */
async function setUserProfile({ sessionid, token }) {
	userStore.setSessionid(sessionid);
	userStore.setToken(token);
	const { data } = await getDrupalProfile();
	userStore.setProfile(data);
}

/**
 *
 * @param {String} uuid
 * @param {string} avatarPath
 * @returns Promise
 */
export function updateUserPicture(uuid, avatarPath) {
	const uid = userStore.profile.uid || 'user';
	const imageData = wx.getFileSystemManager().readFileSync(avatarPath);
	return POST(`/api/v1/user/user/${uuid}/user_picture`, {
		header: {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'file; filename="' + uid + '-picture.jpg"',
		},
		data: imageData,
	});
}

/**
 * update user profile
 */

export function updateUserProfile(id, profile) {
	const arr = REQUEST_BASE_URL.split('/');
	const baseUrl = `${arr[0]}//${arr[2]}`;
	return PATCH(`/user/${id}?_format=hal_json`, {
		header: {
			'Content-Type': 'application/hal+json',
		},
		data: {
			_links: {
				type: {
					href: `${baseUrl}/rest/type/user/user`,
				},
			},
			...profile,
		},
	});
}
/**
 *
 * @returns promise
 */
export function gotoLogin(returnUrl = '') {
	return new Promise((resolve, reject) => {
		showModal({
			content: '您当前未登录',
			cancelText: '返回',
			confirmText: '登录',
			success: function ({ confirm }) {
				if (confirm) {
					if (returnUrl) {
						navigationStore.setReturnUrl(returnUrl);
					}
					gotoPage('/mini/login');
					navigationStore.SET_TAB_BAR_ACTIVE('user');
					resolve(true);
				} else {
					reject(false);
				}
			},
		});
	});
}

/**
 *
 * @param {*} uid
 * @returns Promise
 */
export function getCurrentUserById(uid) {
	const params = [
		`filter[drupal_internal__uid]=${uid}`,
		`include=user_picture,roles`,
		`jsonapi_include=1`,
	].join('&');

	return new Promise((resolve, reject) => {
		GET(`/api/v1/user/user?${params}`)
			.then(({ data }) => {
				const profile = buildProfile(data.data[0]);
				resolve(profile);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

/**
 *
 * @param {*} user
 * @returns profile
 */
const buildProfile = (user) => {
	const coreConfig = userStore.coreConfig;
	let userPicture = '';
	if (user.user_picture.uri && user.user_picture.uri.url) {
		userPicture = user.user_picture.uri.url;
	} else {
		userPicture = coreConfig.defaultAvatar || '';
	}
	return {
		avatar: userPicture,
		name: user.name,
		uid: user.drupal_internal__uid,
		uuid: user.id,
		roles: getRoles(user.roles),
	};
};

const getRoles = (roles) => {
	let rolesObj = {};
	if (isArray(roles)) {
		roles.map((item) => {
			rolesObj[item.drupal_internal__id] = item.label;
		});
	}

	return rolesObj;
};
