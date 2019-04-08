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
		<Item 
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
		</Item>
	</div>
</template>
<script>
import ITEMS from '../constant/Item.js'
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
		person(){
			let position 
			this.dynamicItems.forEach((raw, rawIndex) => {
				raw.forEach((item, colIndex) => {
					if (item.type === 5) {
						position = [rawIndex, colIndex]
					}
				})
			})
			return {
				position,
				type: 5
			}
		},
		boxs(){
			let all = []
			let position 
			this.dynamicItems.forEach((raw, rawIndex) => {
				raw.forEach((item, colIndex) => {
					if (item.type === 2) {
						position = [rawIndex, colIndex]
						all.push({
							position,
							type: 2,
							id: item.id
						})
					}
				})
			})
			return all
		}
	},
	watch: {
	},
	methods: {
		/**
		 * 判断游戏失败|成功|继续
		 */
		isGameContinue(){
			// TODO: 判断游戏是否进行
		},
		/**
		 * 尝试移动一个物品
		 */
		go(position, direction){
			let itemPosi = position
			let willGoPosi = this.calcPosi(itemPosi, direction) // 物品将要移动的位置
			let willGoItem = this.dynamicItems[willGoPosi[0]][willGoPosi[1]].type // 物品信息
			if (this.canMove(willGoPosi)) { // 移动到空气或放置点
				this.moveItem(itemPosi, willGoPosi)
				return true
			} else if (willGoItem === 2) {
				let res = this.go(willGoPosi, direction)
				if (res) {
					this.moveItem(itemPosi, willGoPosi)
					return true
				} else {
					return false
				}
			}
			return false
		},
		/**
		 * 尝试移动人物
		 */
		goPerson(direction){
			this.go(this.person.position, direction)
			this.isGameContinue()
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
		 * 判断指定位置的Item是否可移动
		 */
		canMove(position){
			let [x, y] = position
			let itemType = this.dynamicItems[x][y].type
			if (itemType === 2) {
				return false
			}
			itemType = this.staticItems[x][y]
			if (ITEMS[itemType].canMove || ITEMS[itemType].canThrough) {
				return true
			}
		},
		/**
		 * 记录本次操作造成的移动
		 */
		record(from, to){
			this.history.push(this.lastPositions)
			this.lastPositions = []
		},
		/**
		 * 撤销上次操作
		 */
		undo(){
			if (this.history.length) {
				let last = this.history.pop().reverse()
				last.forEach(posi => {
					this.moveItem(posi.to, posi.from, false)
				})
			}
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
			let id = 0 // ! 
			this.dynamicItems = this.data.map(raw => 
				raw.map(col => {
					if (ITEMS[col].canMove) {
						return {
							type: col,
							id: id++
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
