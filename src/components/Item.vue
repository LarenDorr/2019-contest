<template>
	<!-- 基础Item组件,即基础物品: 箱子|墙壁|人物... -->
	<td>{{type | emojiIt}}</td>
</template>
<script>
import ITEMS from '../constant/Item.js' 

export default {
	name: 'Item',
	props: {
		type: {
			type: Number,
			required: true
		},
		position: {
			type: String
		}
	},
	filters: {
		emojiIt(type){ // 数字映射为emoji
			return ITEMS[type]['value']
		}
	}
}
</script>
