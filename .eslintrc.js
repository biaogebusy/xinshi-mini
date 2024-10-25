module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 2],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-unused-vars': ['error', { varsIgnorePattern: 'regeneratorRuntime' }],
	},
	globals: {
		App: true,
		Page: true,
		wx: true,
		getApp: true,
	},
};
