<template>
	<image
		:src="imageUrlFix(data.src)"
		:mode="data.mode || 'aspectFit'"
		:show-menu-by-longpress="data.longPress || false"
		:style="data.style"
	></image>
</template>
<script>
import { imageUrlFix } from '@utils/image';
export default {
	name: 'ui-img',
	props: {
		data: {
			type: Object,
		},
	},
	setup() {
		return {
			imageUrlFix,
		};
	},
};
</script>
<style lang="scss"></style>
