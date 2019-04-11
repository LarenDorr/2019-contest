<template>
	<div class="control">
		<div v-if="isMobile" class="mobile-control">
			<table class="keys">
				<tr>
					<td></td>
					<td @click="handleClick('up')">⬆️</td>
					<td></td>
				</tr>
				<tr>
					<td @click="handleClick('left')">⬅️</td>
					<td></td>
					<td @click="handleClick('right')">➡️</td>
				</tr>
				<tr>
					<td></td>
					<td @click="handleClick('down')">⬇️</td>
					<td></td>
				</tr>
			</table>
			<table class="keys">
				<tr>
					<td @click="handleClick('confirm')">✔️</td>
					<td></td>
					<td @click="handleClick('reload')">🔄</td>
				</tr>
				<tr>
					<td></td>
					<td @click="handleClick('question')">❓</td>
					<td></td>
				</tr>
				<tr>
					<td @click="handleClick('return')">↩️</td>
					<td></td>
					<td @click="handleClick('cancel')">❌</td>
				</tr>
			</table>
		</div>
		<div class="pc-control" v-else>
			<p>W A S D 进行移动</p>
			<p>Z 撤销上一步操作</p>
			<p>R 重新载入游戏</p>
		</div>
	</div>
</template>
<script>
import Bus from '../utils/Bus'
import OPERATION from '../constant/Operation'

export default {
	name: 'Control',
	data(){
    return {
      isMobile: /Mobile/i.test(navigator.userAgent)
    }
  },
	mounted(){
		this.registerKey()
	},
	methods: {
		handleClick(key){
			Bus.$emit('control', OPERATION[key])
		},
		registerKey(){
			let register = document.body.addEventListener
			let map = {
				'w': OPERATION.up,
				'a': OPERATION.left,
				's': OPERATION.down,
				'd': OPERATION.right
			}
			register('keyup', event => {
				let key = event.key
				if (Object.keys(map).includes(key)) { // 按键为 w a s d 时, 移动人物
					Bus.$emit('control', map[key])
				}
				if (key === 'z') { // 按键为z, 撤销上次操作
					Bus.$emit('control', OPERATION.return)
				}
				if (key === 'r') { // 重开
					Bus.$emit('control', OPERATION.reload)
				}
				// TODO: esc space
			})
		}
	}
}
</script>
<style>
.mobile-control{
	font-size: 2em;
	margin-top: 40px;
}
.pc-control{
	margin-top: 40px;
}
.pc-control p{
	margin-top: 10px;
}
.keys{
	display: inline-block;
	margin: 0 20px;
}
.keys td{
	width: 44px;
	height: 44px;
}
</style>
