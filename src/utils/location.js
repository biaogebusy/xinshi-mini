/**
 * * 计算两个经纬度距离 https://blog.csdn.net/wzp20092009/article/details/124686783
 * @param {Number} lat1
 * @param {Number} lng1
 * @param {Number} lat2
 * @param {Number} lng2
 * @returns {Number} 距离 | 米
 */
export function getDistance(point1, point2) {
	//	角度转换成弧度
	const rad = d => {
		return (d * Math.PI) / 180.0;
	};

	let { latitude: x1, longitude: y1 } = point1;
	let { latitude: x2, longitude: y2 } = point2;
	let Lat1 = rad(x1); // 纬度
	let Lat2 = rad(x2);
	let a = Lat1 - Lat2; //	两点纬度之差
	let b = rad(y1) - rad(y2); //	经度之差
	let s =
		2 *
		Math.asin(
			Math.sqrt(
				Math.pow(Math.sin(a / 2), 2) +
					Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2),
			),
		);
	//	计算两点距离的公式
	s = s * 6378137.0; //	弧长等于弧度乘地球半径（半径为米）
	s = Math.round(s * 10000) / 10000; //	精确距离的数值
	return Math.round(s / 1000);
}
