<template>
	<div class="selects">
		<Select
			:title="currentSelectValue.title"
			:options="currentSelectValue.options"
			:operation="operation"
			@select="handleSelect"
		>
		</Select>
	</div>
</template>
<script>
import Bus from '../utils/Bus'
import Select from './common/Select'

export default {
	name: 'LevelSelects',
	data(){
		return {
			selects:[
				{
					name: 'diffcult',
					value: {
						title: '选择难度',
						options: [
							{
								text: '简单',
								value: 'easy'
							},
							{
								text: '中等',
								value: 'medium'
							},
							{
								text: '较难',
								value: 'hard'
							},
						]
					}
				},
				{
					name: 'level',
					value: {
						title: '选择关卡',
						options: [
							{
								text: '1',
								value: 0
							},
							{
								text: '2',
								value: 1
							},
							{
								text: '3',
								value: 2
							},
						]
					},
				}
			],
			data: {},
			currentSelect: 0,
			operation: {
				value: 'none'
			}
		}
	},
	computed: {
		currentSelectValue(){ // 当先选择的值
			return this.selects[this.currentSelect].value
		}
	},
	mounted(){
		this.registerKey()
	},
	methods: {
		/**
		 * 注册控制事件
		 */
		registerKey(){
			Bus.$on('control', (operation) => {
				this.operation = {
					value: operation
				}
			})
		},
		/**
		 * 处理选择的值
		 */
		handleSelect(value){
			let currentSelectName = this.selects[this.currentSelect].name
			let currentSelectValue = this.selects[this.currentSelect].value.options[value].value
			this.$set(this.data, currentSelectName, currentSelectValue)
			if (this.currentSelect !== this.selects.length - 1) {
				this.currentSelect++
			} else {
				this.$emit('selects', this.data)
				this.currentSelect = 0
			}	
		}
	},
	components: {
		Select
	}
}
</script>
<style>
.selects{
	position: absolute;
	width: 70%;
	height: 35%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -60%);
}
</style>

