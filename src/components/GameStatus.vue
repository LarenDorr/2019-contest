<template>
	<div class="status">
		<!-- 游戏步数 -->
		<span class="statu">👟: {{status.steps}}</span>
		<!-- 游戏完成度 -->
		<span class="statu">🏁: {{status.done[0]}}/{{status.done[1]}}</span>
	</div>
</template>
<script>
export default {
	name: 'GameStatus',
	props: {
		status: {
			type: Object,
			required: true
		}
	},
}
</script>
<style>
.status{
	display: flex;
}
.statu{
	width: 50%;
	font-size: 2em;
}
</style>
