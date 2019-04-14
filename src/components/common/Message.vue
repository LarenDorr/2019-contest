<template>
	<!-- 通用消息组件, 通知信息 -->
	<div class="message" :class="borderStyle">
		<p>{{content}}</p>
	</div>
</template>
<script>
export default {
	name: 'Message',
	props: {
		type: {
			type: String,
			required: false
		},
		content: {
			type: String,
			required: true
		}
	},
	computed: {
		borderStyle(){
			return {
				'success': this.type === 'success',
				'failed': this.type === 'failed'
			}
		}
	}
}
</script>
<style>
.message{
	position: absolute;
	left: 50%;
	top: 20%;
	width: 40%;
	height: 10%;
	box-shadow: 0px 0px 4px #ccc;
	border-radius: 20px;
	background-color: white;
	transform: translate(-50%, -60%);
}
.success{
	box-shadow: 0px 0px 4px green;
}
.failed{
	box-shadow: 0px 0px 4px red;
}
.message p{
	margin-top: 5%;
}
</style>
