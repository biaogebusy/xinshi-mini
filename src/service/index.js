/**
 * * 统一导出请求方法
 */

// * user
export {
	auth,
	wechatUserBindDrupalUser,
	wechatBindDrupalPhoneUser,
	appLogin,
	gotoLogin,
	getPhoneCaptcha,
	getDrupalProfile,
	getDrupalUserState,
	updateUserPicture,
	updateUserProfile,
	checkRoleShow,
	getCurrentUserById,
	loginOrRegisterByPhone,
} from './modules/user';

// * load page
export {
	loadLandingPage,
	statistics,
	loadBaseConfig,
	shareWX,
	updateAttributes,
	addNode,
} from './modules/page';

// * api
export {
	isFlagged,
	flagging,
	flaggingDelete,
	commentAdd,
	commentList,
	uploadFile,
} from './modules/api';

export { submitWebform } from './modules/form';
