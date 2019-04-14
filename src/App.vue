<template>
  <div id="app">
    <!-- 游戏名称 -->
    <Title></Title>
    <!-- 游戏主窗口: 显示及状态 -->
    <Window></Window>
    <!-- 游戏控制 -->
    <GameControl></GameControl>
  </div>
</template>

<script>
import Title from './components/Title'
import Window from './components/Window'
import GameControl from './components/GameControl'

export default {
  name: 'app',
  components: {
    Title,
    Window,
    GameControl
  }
}
</script>

<style>
html,body{
  height: 100%;
}
*{
  margin: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
