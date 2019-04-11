<template>
	<div class="window">
		<GameBoard :data="data" @status="handleStatus"></GameBoard>
		<Status :status="status"></Status>
	</div>
</template>
<script>
// TODO: 难度选择
import GameBoard from './GameBoard'
import Status from './Status'

export default {
	name: 'Window',
	data(){
    return {
      data: [ // 初始地图
				[0,0,1,1,1,1,1,0],
				[1,1,1,0,0,1,1,1],
				[1,0,0,0,0,0,4,1],
				[1,0,2,1,1,1,0,1],
				[1,0,2,0,0,0,0,1],
				[1,5,0,0,0,0,0,1],
				[1,0,0,4,1,1,1,1],
				[1,1,1,1,1,0,0,0]
			],
			status: {
				steps: 0,
				done: [0, 0]
			}
    }
  },
	methods:{
		handleStatus(status){
			this.status = status
		}
	},
	components: {
    GameBoard,
		Status
  }
}
</script>
<style>
.window{
}
</style>
