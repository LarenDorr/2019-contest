<template>
	<div class="game-board">
		<table class="board-table">
			<tr v-for="(raw, rawIndex) in staticItems">
				<Item 
					v-for="(col, colIndex) in raw"
					class="cell"
					:type="col"
					:position="rawIndex+'-'+colIndex"
				>
				</Item>
			</tr>
		</table>
		<!-- <Item 
			class="cell dynamic"
			v-for="item in boxs"
			:type="item.type"
			:key="item.id"
			:style="getCSSFromPosi(item.position)"
		>
		</Item>
		<Item
			class="cell dynamic"
			:type="person.type"
			:style="getCSSFromPosi(person.position)"
		>
		</Item> -->
		<Item
			v-for="item in boxs.concat(person)"
			:key="item.id"
			:type="item.type"
			class="cell dynamic"
			:style="getCSSFromPosi(item.position)"
		>
		</Item>
	</div>
</template>
<script>
import ITEMS from '../constant/Item.js'
import Matrix from '../utils/matrix.js'

import Item from './Item'
// TODO: 错误控制
export default {
	name: 'GameBoard',
	props: {
		data: {
			type: Array
		}
	},
	data(){
		return {
			staticItems: [[]], // 不可移动的Item, 墙壁|放置点
			dynamicItems: [[]], // 可移动的Item, 人物|箱子
			history: [], // 步骤记录,
			lastPositions: [] // 此次操作移动的记录
		}
	},
	mounted(){
		this.registerKey()
		this.initData()
	},
	computed: {
		person(){ // 人物
			let personPosi
			Matrix.forEach(this.dynamicItems, (item, position) => {
				if (item.type === 5) {
					personPosi = position
				}
			})
			return {
				position: personPosi,
				type: 5
			}
		},
		boxs(){ // 箱子
			let all = []
			let position
			Matrix.forEach(this.dynamicItems, (item, position) => {
				if (item.type === 2) {
					let {type, id, canMove} = item
					all.push({
						position,
						type,
						id,
						canMove
					})
				}
			})
			return all
		},
		places(){ // 放置点
			let all = []
			Matrix.forEach(this.staticItems, (item, position) => {
				if (item === 4) {
					all.push(position)
				}
			})
			return all
		},
		isSuccess(){ // 判断是否在成功, 即箱子都在放置点
			let boxPosi = this.boxs.map(box => box.position.toString())
			return this.places.every(place => {
				place = place.toString()
				return boxPosi.includes(place)
			})
		},
		isFailed(){ // 判断是否失败, 即箱子在都角落且不都在放置点
			return this.boxs.every(box => !box.canMove)
		}
	},
	watch: {
	},
	methods: {
		/**
		 * 判断游戏失败|成功|继续
		 */
		willGameContinue(){
			// TODO: 判断游戏是否进行
			if (this.isSuccess) {
				console.log('成功!')
				return
			}
			if (this.isFailed) {
				console.log('失败!')
				return
			}
		},
		/**
		 * 尝试移动一个物品
		 */
		go(position, direction){
			let itemPosi = position
			let willGoPosi = this.calcPosi(itemPosi, direction) // 物品将要移动的位置
			let willGoItem = this.dynamicItems[willGoPosi[0]][willGoPosi[1]] // 物品信息
			if (this.canMove(willGoPosi)) { // 移动到空气或放置点
				this.moveItem(itemPosi, willGoPosi)
				this.checkBoxs()
				return true
			} else if (willGoItem.type === 2) { // 移动的到的位置为箱子
				if (!willGoItem.canMove) {
					return false
				}
				let res = this.go(willGoPosi, direction)
				if (res) {
					this.moveItem(itemPosi, willGoPosi)
					this.checkBoxs()
					return true
				}
			}
			return false
		},
		/**
		 * 尝试移动人物
		 */
		goPerson(direction){
			this.go(this.person.position, direction)
			this.willGameContinue()
		},
		/**
		 * 移动物品
		 */
		moveItem(from, to, record = true){ // 移动Item, 默认Item在from处
			if (record) {
				this.lastPositions.push({
					from,
					to
				})
			}
			let [x, y] = from
			let [n, m] = to
			let item = this.dynamicItems[x][y]
			this.$set(this.dynamicItems[n], m, item)
			this.$set(this.dynamicItems[x], y, 0)
		},
		/**
		 * 根据方向计算移动到的位置
		 */
		calcPosi(position, direction){
			if (direction === 'up') {
				return [position[0] - 1, position[1]]
			}
			if (direction === 'down') {
				return [position[0] + 1, position[1]]
			}
			if (direction === 'left') {
				return [position[0], position[1] - 1]
			}
			if (direction === 'right') {
				return [position[0], position[1] + 1]
			}
		},
		/**
		 * 判断是否可以移动到position处
		 */
		canMove(position){
			let [x, y] = position
			let item = this.dynamicItems[x][y] // 先检查动态物品
			let itemType = item.type || item
			if (itemType === 2) { // 该处有箱子时
				return false
			}
			itemType = this.staticItems[x][y] // 再检查静态物品
			if (ITEMS[itemType].canThrough) {
				return true
			}
			return false
		},
		/**
		 * 记录本次操作造成的移动 // TODO: canmove 改变
		 */
		record(from, to){
			this.history.push(this.lastPositions)
			this.lastPositions = []
		},
		/**
		 * 撤销上次操作
		 */
		undo(){
			if (this.history.length) { // 当历史记录中有操作时
				let last = this.history.pop().reverse()
				last.forEach(posi => {
					this.moveItem(posi.to, posi.from, false)
				})
				this.checkBoxs() // 重算箱子的状态
			}
		},
		/**
		 * 检测箱子是否还能移动
		 */
		checkBoxs(){
			let hasBlock = [] // 该位置上下左右是否阻塞
			let res
			this.boxs.forEach(box => {
				let around = Matrix.getAround(this.staticItems, box.position) // 检查周围的静态物品
				around.forEach(item => {
					if (!ITEMS[item.value].canThrough) {
						hasBlock.push(1)
					} else {
						hasBlock.push(0)
					}
				})
				around = Matrix.getAround(this.dynamicItems, box.position) // 检查周围不可移动箱子
				around.forEach((item, index) => {
					item = item.value
					if (item && !item.canMove) {
						hasBlock[index] = 1
					}
				})
				let count = hasBlock.reduce((acc, cur) => acc + cur) // 阻塞面数
				if (count >= 3) { // 三\四面阻塞则冻结
					this.freezeItem(box.position)
				} else if (count === 2) { // 两面阻塞, 不可连续
					let noBlock = hasBlock[0] === 1 && hasBlock[2] === 1 // 上下不阻塞
					noBlock = noBlock || (hasBlock[1] === 1 && hasBlock[3] === 1) // 左右不阻塞
					if (!noBlock) { // 剩余情况为连续两面, 则必阻塞
						this.freezeItem(box.position)
					} else {
						this.unFreezeItem(box.position)
					}
				} else {
					this.unFreezeItem(box.position)
				}
				
				hasBlock = []
			})
			
		},
		/**
		 * 冻结箱子
		 */
		freezeItem(position){
			let [x, y] = position
			this.$set(this.dynamicItems[x], y , {
				...this.dynamicItems[x][y],
				canMove: false
			})
		},
		/**
		 * 解冻箱子, 回退状态时使用
		 */
		unFreezeItem(position){
			let [x, y] = position
			this.$set(this.dynamicItems[x], y , {
				...this.dynamicItems[x][y],
				canMove: true
			})
		},
		refresh(){
			this.initData()
			this.history = []
		},
		/**
		 * 根据位置计算CSS值
		 */
		getCSSFromPosi(position){ // 根据坐标计算CSS left|right值
			if (position) {
				return {
					top: `${position[0] * 44}px`,
					left: `${position[1] * 44}px`
				}
			}
		},
		/**
		 * 注册键盘事件
		 */
		registerKey(){
			let register = document.body.addEventListener
			let map = {
				'w': 'up',
				'a': 'left',
				's': 'down',
				'd': 'right'
			}
			register('keyup', event => {
				let key = event.key
				if (Object.keys(map).includes(key)) { // 按键为 w a s d 时, 移动人物
					this.goPerson(map[key])
					this.record()
				}
				if (key === 'z') { // 按键为z, 撤销上次操作
					this.undo()
				}
				if (key === 'r') { // 重开
					this.refresh()
				}
			})
		},
		/**
		 * 分离原始数据, 分为静态Item(墙|放置点), 动态Item(人物|箱子)
		 */
		initData(){
			this.staticItems = this.data.map(raw => 
				raw.map(col => {
					if (!ITEMS[col].canMove) {
						return col
					} else {
						return 0
					}
				})
			)
			let id = 0 
			this.dynamicItems = this.data.map(raw => 
				raw.map(col => {
					if (ITEMS[col].canMove) {
						return {
							type: col,
							id: id++,
							canMove: true
						}
					} else {
						return 0
					}
				})
			)
		}
	},
	components: {
		Item
	}
}
</script>
<style>
.game-board{
	position: relative;
}
.board-table{
	border-spacing: 0;
	border-collapse:collapse;
}
.cell{
	width: 44px;
	height: 44px;
	font-size: 2em;
	padding: 0;
	transition: all 0.2s ease;
}
.dynamic{
	position: absolute;
}
</style>
