import { defineStore } from 'pinia';
import { setStorageSync, getStorageSync, clearStorageSync } from '@tarojs/taro';
export const useNavigationStore = defineStore('navigation', {
	state: () => ({
		title: '',
		backButton: true,
		tabBar: false,
		navBarBackground: 'var(--navbar-background)',
		navBarColor: 'var(--navbar-color)',
		tabBarActive: 'home',
		returnUrl: getStorageSync('returnUrl'),
	}),
	getters: {
		showBackButton({ showTabBar }) {
			return showTabBar ? false : true;
		},
	},
	actions: {
		SET_TITLE(data) {
			this.title = data;
		},
		SET_TAB_BAR(data) {
			this.tabBar = data;
		},
		SET_BACK_BUTTON(data) {
			this.backButton = data;
		},
		SET_NAVBAR_BACKGROUND(data) {
			this.navBarBackground = data;
		},
		SET_NAVBAR_COLOR(data) {
			this.navBarColor = data;
		},
		SET_TAB_BAR_ACTIVE(data) {
			this.tabBarActive = data;
		},

		setReturnUrl(url) {
			this.returnUrl = url;
			setStorageSync('returnUrl', url);
		},
	},
});
