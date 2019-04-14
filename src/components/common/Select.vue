<template>
	<!-- 通用选择组件, 循环选择选项 -->
	<div class="select">
		<p class="select-title">{{title}}</p>
		<div class="select-options">
			<p v-for="(text, index) in texts" :key="index">{{text}}</p>
		</div>
	</div>
</template>
<script>
import OPERATION from '../../constant/Operation'

export default {
	name: 'Select',
	props: {
		title: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true
		},
		operation: {
			type: Object,
			required: true
		}
	},
	data(){
		return {
			nowValue: 0
		}
	},
	computed: {
		values(){ // 选项的值
			return this.options.map(option => option.value)
		},
		texts(){ // 选项的显示文本
			return this.options.map((option, index) => {
				if (index === this.nowValue) {
					return '👉' + option.text
				} else {
					return option.text
				}
			})
		}
	},
	watch: {
		operation(operate){ // 根据操作改变选项值
			operate = operate.value
			let map = {
				[OPERATION.up]: () => { // 向上
					if (this.nowValue !== 0) {
						this.nowValue --
					} else {
						this.nowValue = this.options.length - 1
					}
				},
				[OPERATION.down]: () => { // 向下
					if (this.nowValue !== this.options.length - 1) {
						this.nowValue ++
					} else {
						this.nowValue = 0
					}
				},
				[OPERATION.confirm]: () => { // 确认
					this.$emit('select', this.nowValue)
					this.nowValue = 0
				}
			}
			if (Object.keys(map).includes(operate)) {
				map[operate]()				
			}
		}
	}
}
</script>
<style>
.select{
	box-shadow: 2px 2px 10px #ccc;
	background-color: white;
	border-radius: 20px;
	height: 100%;
}
.select-title{
	font-size: 1.2em;
	padding-top: 4px;
}
.select-options{
	margin-top: 10px;
}
</style>

