/**
 * * 数组打乱顺序：Fisher-Yates shuffle
 * @param {*} arr 需要打乱顺序的数组
 * @returns arr 打乱顺序后的数组
 */
export function fisherYates(arr) {
	for (let i = 0; i < arr.length - 1; i++) {
		// 获取 i 到 arr.length - 1 之间的随机数
		const random = rangeRandomNumber(i, arr.length - 1);

		// 交换第 i 个数和随机数的值
		[arr[i], arr[random]] = [arr[random], arr[i]];
	}

	return arr;
}

/**
 * * 获取 [min, max] 之间的随机数
 * @param {*} min 期望最小值
 * @param {*} max 期望最大值
 * @returns 随机值
 */
export function rangeRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
