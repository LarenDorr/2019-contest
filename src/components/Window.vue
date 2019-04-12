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
		<Status
			:status="status"
		></Status>
		<!-- 游戏难度|关卡选择 -->
		<Selects
			v-if="!isGaming"
			@selects="handleSelects"
		>
		</Selects>
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
import Selects from './Selects'
import GameBoard from './GameBoard'
import Status from './Status'
import Message from './common/Message'
import GameMaps from '../constant/GameMaps'

// TODO: 初始map
export default {
	name: 'Window',
	data(){
    return {
      map: [ // 初始地图
      	[0, 0, 0, 1, 1, 1, 1, 0],
      	[1, 1, 1, 0, 0, 0, 1, 1],
      	[1, 4, 0, 0, 0, 0, 4, 1],
      	[1, 0, 0, 2, 1, 0, 4, 1],
      	[1, 1, 0, 2, 1, 0, 1, 1],
      	[0, 1, 0, 2, 0, 0, 1, 1],
      	[0, 1, 0, 0, 1, 0, 5, 1],
      	[0, 1, 1, 1, 1, 1, 1, 1]
      ],
			status: {
				steps: 0,
				done: [0, 0]
			},
			isGaming: false,
			message: {
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
		handleStatus(status){
			this.status = status
		},
		handleSelects(selects){
			let {diffcult, level} = selects
			let map = GameMaps[diffcult][level]
			this.map = map
			this.isGaming = true
		},
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
		clearMessage(){
			this.message.type = ''
			this.message.content = ''
		},
		reSelect(){
			this.isGaming = false
		}
	},
	components: {
    GameBoard,
		Status,
		Selects,
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
