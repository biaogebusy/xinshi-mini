/**
 * * 日期格式化程序
 *
 * @param {String|Number} date 日期
 * @param {String} rules 格式
 * @returns {String} 格式化后的日期
 */
function dateFormat(date, rules = 'Y-m-d H:i:s') {
	const currentDate = date ? new Date(date) : new Date();
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1;
	const day = currentDate.getDate();
	const hour = currentDate.getHours();
	const minute = currentDate.getMinutes();
	const seconds = currentDate.getSeconds();
	const week = currentDate.getDay();

	return rules
		.replace('Y', year)
		.replace('m', month >= 10 ? month : `0${month}`)
		.replace('d', day >= 10 ? day : `0${day}`)
		.replace('H', hour >= 10 ? hour : `0${hour}`)
		.replace('i', minute >= 10 ? minute : `0${minute}`)
		.replace('s', seconds >= 10 ? seconds : `0${seconds}`)
		.replace('D', week);
}

function isExpired(dateString) {
	if (!dateString) {
		return false;
	}
	try {
		const inputDate = new Date(dateString);
		const currentDate = new Date();

		if (inputDate < currentDate) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error('日期格式不正确或无法解析。请使用正确的日期格式。');
	}
}

/**
 * * 统一导出
 */
export { dateFormat, isExpired };
