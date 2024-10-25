import { defineConfig } from 'windicss/helpers';

export default defineConfig({
	extract: {
		// A common use case is scanning files from the root directory
		include: ['src/**/*.vue'],
		// if you are excluding files, make sure you always include node_modules and .git
		exclude: ['node_modules', '.git', 'dist'],
	},
	corePlugins: {
		// 禁用掉在小程序环境中不可能用到的 plugins
		container: false,
	},
	safelist: (() => {
		let safelist = [];

		// 间距安全清单
		['xs', 'sm', 'md', 'lg', 'xl'].forEach(item => {
			safelist.push(`px-${item} py-${item} mx-${item} my-${item}`);
		});

		// 背景安全清单
		// [
		// 	'base',
		// 	'light',
		// 	'primary',
		// 	'white',
		// 	'black',
		// 	'success',
		// 	'error',
		// 	'warning',
		// 	'error',
		// ].forEach(item => {
		// 	safelist.push(`bg-${item}`);
		// });

		// 其他安全清单

		// console.log(safelist);
		return safelist;
	})(),
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary-color)',
				second: 'var(--second-color)',
				success: 'var(--success-color)',
				info: 'var(--info-color)',
				error: 'var(--error-color)',
				warning: 'var(--warning-color)',
				black: 'var(--black-color)',
				white: 'var(--white-color)',
			},
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
			},
			borderColor: {
				base: 'var(--border-color)',
				primary: 'var(--primary-color)',
				success: 'var(--success-color)',
				info: 'var(--info-color)',
				error: 'var(--error-color)',
				warning: 'var(--warning-color)',
				black: 'var(--black-color)',
				white: 'var(--white-color)',
			},
			borderRadius: {
				sm: 'var(--border-radius-sm)',
				md: 'var(--border-radius-md)',
				lg: 'var(--border-radius-lg)',
				max: 'var(--border-radius-max)',
			},
			borderWidth: {
				base: 'var(--border-width-base)',
				sm: 'var(--border-width-sm)',
				md: 'var(--border-width-md)',
			},
			textColor: {
				color: 'var(--text-color)',
				light: 'var(--text-color-light)',
				lighter: 'var(--text-color-lighter)',
				dark: 'var(--text-color-dark)',
				primary: 'var(--primary-color)',
				success: 'var(--success-color)',
				error: 'var(--error-color)',
				warning: 'var(--warning-color)',
				black: 'var(--black-color)',
				white: 'var(--white-color)',
			},
			fontSize: {
				xs: 'var(--font-size-xs)',
				sm: 'var(--font-size-sm)',
				md: 'var(--font-size-md)',
				lg: 'var(--font-size-lg)',
				xl: 'var(--font-size-xl)',
			},
			fontFamily: {
				family: 'var(--font-family)',
			},
			backgroundColor: {
				lighter: 'var(--background-color-lighter)',
				primary: 'var(--primary-color)',
				success: 'var(--success-color)',
				info: 'var(--info-color)',
				warning: 'var(--warning-color)',
				error: 'var(--error-color)',
				black: 'var(--black-color)',
				'black-50': 'var(--black-color-50)',
				white: 'var(--white-color)',
			},
		},
	},
});
