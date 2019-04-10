// 矩阵的通用方法

export default {
	/**
	 * 遍历矩阵, 通过回调来获得元素的值与坐标
	 *
	 * @param {[[]]} matrix
	 * @param {Function} cb
	 */
	forEach(matrix, cb){
		matrix.forEach((raw, rawIndex) => {
			raw.forEach((value, colIndex) => {
				cb(value, [rawIndex, colIndex])
			})
		})
	},
	/**
	 * 获取该元素周围的值和位置, 顺序为顺时针方向
	 *
	 * @param {[[]]} matrix
	 * @param {[]} position
	 */
	getAround(matrix, position){
		let width = matrix[0].length
		let height = matrix.length
		let [x, y] = position
		let all = []
		all.push([x - 1, y]) // 上
		all.push([x, y + 1]) // 右
		all.push([x + 1, y]) // 下
		all.push([x, y - 1]) // 左
		all = all.filter(posi => posi[0] >= 0 && posi[0] < width && posi[1] >= 0 && posi[1] < height) // 过滤边界元素
		all = all.map(position => ({
			position,
			value: matrix[position[0]][position[1]]
		}))
		return all
	}
}