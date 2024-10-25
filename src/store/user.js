import { defineStore } from 'pinia';
import { setStorageSync, getStorageSync, clearStorageSync } from '@tarojs/taro';
import { GET } from '../service/http';

export const useUserStore = defineStore('user', {
	state: () => ({
		token: getStorageSync('csrf_token'),
		sessionid: getStorageSync('sessionid'),
		profile: getStorageSync('profile'),
		latitude: getStorageSync('latitude'),
		longitude: getStorageSync('longitude'),
		address: getStorageSync('address'),
		code: getStorageSync('code'),
		coreConfig: null,
	}),
	getters: {
		isCodeLoading: state => !state.code,
	},
	actions: {
		setToken(token) {
			setStorageSync('csrf_token', token);
			this.token = token;
		},
		setSessionid(sessionid) {
			setStorageSync('sessionid', sessionid);
			this.sessionid = sessionid;
		},
		setProfile(profile) {
			setStorageSync('profile', profile);
			this.profile = profile;
			this.updateCode();
		},
		setUserLocation({ latitude, longitude }) {
			this.latitude = latitude;
			this.longitude = longitude;
			setStorageSync('latitude', latitude);
			setStorageSync('longitude', longitude);
		},
		clearUserInfo() {
			clearStorageSync('token');
			clearStorageSync('sessionid');
			clearStorageSync('profile');
			clearStorageSync('code');
			clearStorageSync('latitude');
			clearStorageSync('longitude');
			this.token = null;
			this.sessionid = null;
			this.profile = null;
			this.code = null;
		},
		async updateCode() {
			const {
				data: { recommended_code },
			} = await GET('/api/v3/personalProfile?noCache=1');
			setStorageSync('code', recommended_code);
			this.code = recommended_code;
		},
		async checkDrupalUserState() {
			const { data: state } = await GET(
				'/user/login_status?_format=json&noCache=1',
			);
			if (!state) {
				this.clearUserInfo();
			}
		},
		setAddress(address) {
			this.address = address;
			setStorageSync('address', address);
		},
		setCoreConfig(config) {
			this.coreConfig = config;
			setStorageSync('coreConfig', config);
		},
	},
});

export default useUserStore;
