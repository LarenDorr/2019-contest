<template>
	<div class="status">
		<span class="statu">👟: {{status.steps}}</span>
		<span class="statu">🏁: {{status.done[0]}}/{{status.done[1]}}</span>
	</div>
</template>
<script>
export default {
	name: 'Status',
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
	margin: 20px 0 0 0;
	display: flex;
}
.statu{
	width: 50%;
	font-size: 2em;
}
</style>
