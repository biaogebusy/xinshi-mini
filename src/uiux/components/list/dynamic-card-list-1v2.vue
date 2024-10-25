<template>
	<div class="dynamic-card-list-1v2">
		<Card1v0 v-for="(item, index) in data.elements" :key="index" :data="item" />
	</div>
</template>
<script>
import Card1v0 from '@uiux/widgets/card/card-1v0.vue';
export default {
	name: 'dynamic-card-list-1v2',
	components: {
		Card1v0,
	},
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	setup() {
		return {};
	},
};
</script>

<style lang="scss"></style>
