<template>
	<div class="link" @click="goto">
		{{ data.title }}
	</div>
</template>
<script>
import { gotoPage } from '@utils/index';
export default {
	name: 'link',
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	setup({ data }) {
		const goto = () => {
			gotoPage(data.url);
		};
		return {
			goto,
		};
	},
};
</script>
<style lang=""></style>
