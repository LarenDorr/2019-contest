<template>
	<div class="game-board">
		<!-- 静态Item -->
		<table class="board-table">
			<tr
				v-for="(raw, rawIndex) in staticItems"
				:key="rawIndex"
			>
				<Item 
					v-for="(col, colIndex) in raw"
					class="cell"
					:key="rawIndex+'-'+colIndex"
					:type="col"
					:position="rawIndex+'-'+colIndex"
				>
				</Item>
			</tr>
		</table>
		<!-- 动态Item -->
		<Item
			v-for="item in boxsAndPerson"
			:key="item.id"
			:type="item.type"
			class="cell dynamic"
			:style="getCSSFromPosi(item.position)"
		>
		</Item>
	</div>
</template>
<script>
import OPERATION from '../constant/Operation'
import ITEMS from '../constant/Item.js'
import Matrix from '../utils/Matrix.js'
import Bus from '../utils/Bus'
import Item from './Item'

// TODO: 错误控制
export default {
	name: 'GameBoard',
	props: {
		mapData: {
			type: Array
		},
		isGaming: {
			type: Boolean
		}
	},
	data(){
		return {
			staticItems: [[]], // 不可移动的Item, 墙壁|放置点
			dynamicItems: [[]], // 可移动的Item, 人物|箱子
			history: [], // 步骤记录
			lastPositions: [] // 此次操作移动的记录
		}
	},
	mounted(){
		this.registerControl()
		this.initData()
		this.checkStatus()
	},
	watch: {
		mapData(){ // 地图数据改变时开始新游戏
			this.initData()
			this.checkStatus()
			this.history = []
		}
	},
	computed: {
		person(){ // 人物数据
			let personPosi
			Matrix.forEach(this.dynamicItems, (item, position) => {
				if (item.type === 5) {
					personPosi = position
				}
			})
			if (personPosi) {
				return {
					position: personPosi,
					type: 5
				}
			} else {
				return {}
			}
		},
		boxs(){ // 箱子数据
			let all = []
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
		boxsAndPerson(){
			if (Object.keys(this.person).length) {
				return this.boxs.concat(this.person)
			}
			return this.boxs
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
	methods: {
		/**
		 * 判断游戏失败|成功|继续
		 */
		willGameContinue(){
			this.checkStatus()
			if (this.isSuccess) {
				this.$emit('result', true)
				return
			}
			if (this.isFailed) {
				this.$emit('result', false)
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
			let hasGo = this.go(this.person.position, direction)
			if (hasGo) {
				this.record()
				this.willGameContinue()
			}
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
		 * 记录本次操作造成的移动
		 */
		record(){
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
				this.checkStatus()
			}
		},
		/**
		 * 检查游戏状态并emit
		 */
		checkStatus(){
			let boxsPosi = this.boxs.map(box => box.position)
			let count = 0
			this.places.forEach(place => {
				boxsPosi.forEach(box => {
					if (place.toString() === box.toString()) {
						count++
					}
				})
			})
			this.$nextTick(() => {
				this.$emit('status', {
					steps: this.history.length,
					done: [count, boxsPosi.length]
				})
			})
		},
		/**
		 * 检测箱子是否还能移动
		 */
		checkBoxs(){
			let hasBlock = [] // 该位置上下左右是否阻塞
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
				} else if (count === 2) { // 两面阻塞
					let noBlock = hasBlock[0] === 1 && hasBlock[2] === 1 // 上下不阻塞
					noBlock = noBlock || (hasBlock[1] === 1 && hasBlock[3] === 1) // 左右不阻塞
					if (!noBlock) { // 连续两面, 则必阻塞
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
		 * 解冻箱子(回退状态时使用)
		 */
		unFreezeItem(position){
			let [x, y] = position
			this.$set(this.dynamicItems[x], y , {
				...this.dynamicItems[x][y],
				canMove: true
			})
		},
		/**
		 * 重新开始
		 */
		refresh(){
			this.initData()
			this.history = []
			this.checkStatus()
		},
		/**
		 * 根据位置计算CSS值
		 */
		getCSSFromPosi(position){
			if (position) {
				return {
					top: `${position[0] * 40 + 10}px`,
					left: `${position[1] * 40 + 10}px`
				}
			}
		},
		/**
		 * 注册控制事件
		 */
		registerControl(){
			let directionMap = ['UP', 'DOWN', 'LEFT', 'RIGHT']
			let that = this
			let map = {
				[OPERATION.return](){
					that.undo()
				},
				[OPERATION.reload](){
					that.refresh()
				},
				[OPERATION.cancel](){
				}
			}
			Bus.$on('control', operation => {
				if (!this.isGaming) {
					return
				}
				if (directionMap.includes(operation)) {
					that.goPerson(operation.toLocaleLowerCase())
				} else {
					map[operation]()
				}
			})
		},
		/**
		 * 分离原始数据, 分为静态Item(墙|放置点), 动态Item(人物|箱子)
		 */
		initData(){
			this.staticItems = Matrix.map(this.mapData, value => {
				if (!ITEMS[value].canMove) {
					return value
				}
				return 0
			})
			let id = 0
			this.dynamicItems = Matrix.map(this.mapData, value => {
				if (ITEMS[value].canMove) {
					return {
						type: value,
						id: id++,
						canMove: true
					}
				}
				return 0
			})
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
	border-radius: 20px;
	padding: 10px;
}
.board-table{
	border-spacing: 0;
	border-collapse:collapse;
}
.cell{
	width: 40px;
	height: 40px;
	font-size: 1.5em;
	padding: 0;
	transition: all 0.2s ease;
}
.dynamic{
	position: absolute;
	margin-top: 4px;
}
</style>
