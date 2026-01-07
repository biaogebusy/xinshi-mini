import { GET, POST, DELETE } from '../http';

/**
 * * 获取是否已收藏某个 node
 * @param {object} uuid node_uuid
 * @returns Promise
 */
export function isFlagged({ type, entityId }) {
	return GET(`/api/v2/flagging/${type}/${entityId}?noCache=1`);
}

/**
 * * 添加收藏
 * @param {object} data queries
 * @returns Promise
 */
export function flagging(type, data) {
	return POST(`/api/v1/flagging/${type}/`, {
		header: {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
		},
		data: {
			data,
		},
	});
}

/**
 * * 删除收藏
 * @param {object} uuid node_uuid
 * @returns Promise
 */
export function flaggingDelete({ uuid }) {
	return DELETE(`/api/v1/flagging/favorite/${uuid}`);
}

/**
 * * 添加评论
 * @param {*} data queries
 * @returns Promise
 */
export function commentAdd(data) {
	return POST('/api/v1/comment/comment', {
		header: {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
		},
		data: {
			data,
		},
	});
}

/**
 * * 评论列表
 * @param {object} uuid node_uuid
 * @returns Promise
 */
export function commentList({ uuid }) {
	return GET(`/api/v3/comment/comment/${uuid}?noCache=1`, { cache: true });
}

export function uploadFile(filePath, api) {
	const imageData = wx.getFileSystemManager().readFileSync(filePath);
	return POST(api || '/api/v1/media/image/field_media_image', {
		header: {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'file; filename="user.jpg"',
		},
		data: imageData,
	});
}
