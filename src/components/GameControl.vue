<template>
	<div class="control">
		<!-- 移动端控制, 使用emoji键盘 -->
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
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td @click="handleClick('return')">↩️</td>
					<td></td>
					<td @click="handleClick('cancel')">❌</td>
				</tr>
			</table>
		</div>
		<!-- PC端控制, 使用键盘 -->
		<div class="pc-control" v-else>
			<p>W A S D 进行移动/选择</p>
			<p>Space 确认选择</p>
			<p>Esc 返回菜单</p>
			<p>Z 撤销操作</p>
			<p>R 重新载入</p>
		</div>
	</div>
</template>
<script>
import Bus from '../utils/Bus'
import OPERATION from '../constant/Operation'

export default {
	name: 'GameControl',
	data(){
    return {
      isMobile: /Mobile/i.test(navigator.userAgent)
    }
  },
	mounted(){
		this.registerKey()
	},
	methods: {
		/**
		 * 处理 emoji 按键
		 */
		handleClick(key){
			Bus.$emit('control', OPERATION[key])
		},
		/**
		 * 注册键盘事件
		 */
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
				if (key === 'z') { // 撤销上次操作
					Bus.$emit('control', OPERATION.return)
				}
				if (key === 'r') { // 重开
					Bus.$emit('control', OPERATION.reload)
				}
				if (key === ' ') { // 确认
					Bus.$emit('control', OPERATION.confirm)
				}
				if (key === 'Escape') { // 取消
					Bus.$emit('control', OPERATION.cancel)
				}
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
