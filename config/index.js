const path = require('path');
import ComponentsPlugin from 'unplugin-vue-components/webpack';
import NutUIResolver from '@nutui/nutui-taro/dist/resolver';
const config = {
	projectName: 'taro-3.5.5',
	date: '2022-8-28',
	designWidth(input) {
		// 配置 NutUI 375 尺寸
		if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
			return 375;
		}
		// 全局使用 Taro 默认的 750 尺寸
		return 750;
	},
	deviceRatio: {
		640: 2.34 / 2,
		750: 1,
		828: 1.81 / 2,
		375: 2 / 1,
	},
	sourceRoot: 'src',
	outputRoot: 'dist',
	plugins: [
		'@tarojs/plugin-html',
		'taro-plugin-pinia',
		[
			'@dcasia/mini-program-tailwind-webpack-plugin/dist/taro',
			{
				// enableRpx: true,
				// enableDebugLog: true,
				// ...options
				windiCSSConfigFile: path.join(__dirname, '../windi.config.js'),
			},
		],
    [
      '@tarojs/plugin-framework-vue3',
      {
        vueLoaderOption: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('wxParse'),
            whitespace: 'preserve',
            // ...
          },
        },
      },
    ],
		// ...其余插件
	],
	defineConstants: {},
	copy: {
		patterns: [],
		options: {},
	},
	framework: 'vue3',
	compiler: {
		type: 'webpack5',
		prebundle: { enable: false },
	},
	cache: {
		// Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
		enable: false,
	},
	sass: {
		resource: [
			path.resolve(__dirname, '..', 'src/styles/variables/_theme.scss'),
		],
		data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
	},
	mini: {
		// webpackChain(chain) {
		// 	chain.plugin('unplugin-vue-components').use(
		// 		ComponentsPlugin({
		// 			resolvers: [NutUIResolver({ taro: true })],
		// 		}),
		// 	);
		// },
		postcss: {
			pxtransform: {
				enable: true,
				config: {
					selectorBlackList: ['nut-'],
				},
			},
			url: {
				enable: true,
				config: {
					limit: 1024, // 设定转换尺寸上限
				},
			},
			cssModules: {
				enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
				config: {
					namingPattern: 'module', // 转换模式，取值为 global/module
					generateScopedName: '[name]__[local]___[hash:base64:5]',
				},
			},
		},
		// config pinia
		webpackChain(chain) {
			chain.plugin('unplugin-vue-components').use(
				ComponentsPlugin({
					resolvers: [NutUIResolver({ taro: true })],
				}),
			);
			chain.merge({
				module: {
					rule: {
						mjsScript: {
							test: /\.mjs$/,
							include: [/pinia/],
							use: {
								babelLoader: {
									loader: require.resolve('babel-loader'),
								},
							},
						},
					},
				},
			});
		},
		enableExtract: true,
		miniCssExtractPluginOption: {
			//忽略css文件引入顺序
			ignoreOrder: true,
		},
	},
	h5: {
		webpackChain(chain) {
			chain.plugin('unplugin-vue-components').use(
				ComponentsPlugin({
					resolvers: [NutUIResolver({ taro: true })],
				}),
			);
		},
		publicPath: '/',
		staticDirectory: 'static',
		esnextModules: ['nutui-taro'],
		postcss: {
			autoprefixer: {
				enable: true,
				config: {},
			},
			cssModules: {
				enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
				config: {
					namingPattern: 'module', // 转换模式，取值为 global/module
					generateScopedName: '[name]__[local]___[hash:base64:5]',
				},
			},
		},
	},
	alias: {
		'@uiux': path.resolve(__dirname, '..', 'src/uiux'),
		'@components': path.resolve(__dirname, '..', 'src/uiux/components'),
		'@widgets': path.resolve(__dirname, '..', 'src/uiux/widgets'),
		'@service': path.resolve(__dirname, '..', 'src/service'),
		'@images': path.resolve(__dirname, '..', 'src/assets/images'),
		'@utils': path.resolve(__dirname, '..', 'src/utils'),
		'@store': path.resolve(__dirname, '..', 'src/store'),
	},
};

module.exports = function (merge) {
	if (process.env.NODE_ENV === 'development') {
		return merge({}, config, require('./dev'));
	}
	return merge({}, config, require('./prod'));
};
