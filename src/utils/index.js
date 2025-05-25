/**
 * * 配置相关
 */
export { REQUEST_BASE_URL } from './config';

/**
 * * 日起相关
 */
export { dateFormat } from './date';

/**
 * * 用户相关
 */
export { getAppSettings, getUserLocation, getUserAddress } from './auth';

/**
 * 地理位置
 */
export { getDistance } from './location';

export {
	mergeDeep,
	gotoPage,
	checkWxUpdate,
	buildUrlString,
	getParameFromURL,
	toQueryString,
} from './common';
