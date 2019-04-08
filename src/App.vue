<template>
  <div id="app">
    <GameBoard :data="data"></GameBoard>
  </div>
</template>

<script>
import GameBoard from './components/GameBoard'

export default {
  name: 'app',
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
			]
    }
  },
  components: {
    GameBoard
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
