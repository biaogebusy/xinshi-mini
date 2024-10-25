import { REQUEST_BASE_URL } from '@utils/config';

/**
 * * 相对 url 的图片地址自动转换为绝对路径
 *
 * @param {String} url 图片地址
 * @returns	{String} 处理后的图片地址
 */
export function imageUrlFix(url) {
	return typeof url === 'string' && url.startsWith('/')
		? REQUEST_BASE_URL + url
		: url;
}

/**
 * * 富文本修复图片 url 和样式
 *
 * @param {String} richtext 富文本字符串
 * @returns {String} 替换过后的富文本字符串
 */
export function richtextFixer(richtext) {
	return (
		richtext
			// 非贪婪模式匹配所有 src=\"(/.*)\"，替换成 src=\"${REQUEST_BASE_URL}(/.*)\"
			.replace(/(src=\\?")(\/.*?\\?")/g, `$1${REQUEST_BASE_URL}$2`)
			// 图片添加类名 w-full h-auto
			.replace(/(\<img.*?)(\/\>)/g, '$1 class="w-full h-auto block" $2')
	);
}
