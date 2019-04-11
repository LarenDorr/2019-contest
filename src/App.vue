<template>
  <div id="app">
    <Title></Title>
    <Window></Window>
    <Control></Control>
  </div>
</template>

<script>
import Title from './components/Title'
import Window from './components/Window'
import Control from './components/Control'

export default {
  name: 'app',
  components: {
    Title,
    Window,
    Control
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
