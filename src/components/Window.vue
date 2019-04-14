<template>
	<div class="window">
		<!-- 游戏显示区域 -->
		<GameBoard
			:mapData="map"
			@status="handleStatus"
			@result="handleResult"
			:isGaming="isGaming"
			:class="{active: isGaming}"
		>
		</GameBoard>
		<!-- 游戏状态显示 -->
		<GameStatus
			:status="status"
		></GameStatus>
		<!-- 游戏难度|关卡选择 -->
		<LevelSelects
			v-if="!isGaming"
			@selects="handleSelects"
		>
		</LevelSelects>
		<!-- 成功|失败消息提示 -->
		<Message
			v-if="message.type"
			:type="message.type"
			:content="message.content"
		>
		</Message>
	</div>
</template>
<script>
import Bus from '../utils/Bus'
import OPERATION from '../constant/Operation'
import LevelSelects from './LevelSelects'
import GameBoard from './GameBoard'
import GameStatus from './GameStatus'
import Message from './common/Message'
import GameMaps from '../constant/GameMaps'

export default {
	name: 'Window',
	data(){
    return {
      map: [ // 初始地图
      	[1, 0, 0, 0, 0, 0, 0, 1],
      	[0, 1, 0, 0, 0, 0, 1, 0],
      	[0, 0, 1, 0, 0, 1, 0, 0],
      	[0, 0, 0, 1, 1, 0, 0, 0],
      	[0, 0, 0, 1, 1, 0, 0, 0],
      	[0, 0, 1, 0, 0, 1, 0, 0],
      	[0, 1, 0, 0, 0, 0, 1, 0],
      	[1, 0, 0, 0, 0, 0, 0, 1]
      ],
			status: { // 游戏状态
				steps: 0, // 步数
				done: [0, 0] // 完成度 已完成/总目标
			},
			isGaming: false,
			message: { // 消息提示
				type: '',
				content: ''
			}
    }
  },
	mounted(){
		Bus.$on('control', operation => {
			if (operation === OPERATION.cancel) {
				this.reSelect()
			}
		})
	},
	methods:{
		/**
		 * 状态显示
		 */
		handleStatus(status){
			this.status = status
		},
		/**
		 * 处理关卡选择
		 */
		handleSelects(selects){
			let {diffcult, level} = selects
			let map = GameMaps[diffcult][level]
			this.map = map
			this.isGaming = true
		},
		/**
		 * 处理游戏结果(成功|失败)
		 */
		handleResult(result){
			if (result) {
				this.message.type = 'success'
				this.message.content = 'Win'
			} else {
				this.message.type = 'failed'
				this.message.content = 'Game Over'
			}
			setTimeout(() => {
				this.clearMessage()
			}, 2000)
		},
		/**
		 * 清除消息
		 */
		clearMessage(){
			this.message.type = ''
			this.message.content = ''
		},
		/**
		 * 重新选择关卡
		 */
		reSelect(){
			this.isGaming = false
		}
	},
	components: {
    GameBoard,
		GameStatus,
		LevelSelects,
		Message
  }
}
</script>
<style>
.active{
	box-shadow: 2px 2px 10px #ccc;
}
.window{
	position: relative;
}
</style>
