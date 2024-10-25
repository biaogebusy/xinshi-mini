<template>
	<div class="bg-full" :style="style"></div>
</template>
<script>
export default {
	name: 'bg',
	props: {
		style: {
			type: String,
			default() {
				return {
					backgroundColor: 'rgba(240, 240, 240, 1)',
				};
			},
		},
	},
};
</script>
<style lang="scss">
.bg-full {
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 100vw;
	max-width: 100%;
	transform: translateX(-50%);
	z-index: -1;
}
</style>
