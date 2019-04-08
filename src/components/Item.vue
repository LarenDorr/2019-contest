<template>
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
	data(){
		return {
			canMove: ITEMS[this.type]['canMove'],
			canThrough: ITEMS[this.type]['canMove']
		}
	},
	mounted(){
		
	},
	methods: {
	},
	filters: {
		emojiIt(type){ // 数字映射为emoji
			return ITEMS[type]['value']
		}
	}
}
</script>
