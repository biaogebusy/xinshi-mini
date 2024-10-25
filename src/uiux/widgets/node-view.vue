<template>
	<div>{{ view }}</div>
</template>
<script>
import { GET } from '@service/http';
import { ref } from 'vue';
export default {
	name: 'node-view',
	props: {
		nid: {
			type: String,
		},
	},
	setup({ nid }) {
		const view = ref(0);
		GET(`/api/v3/statistics/node/${nid}?no-record=1`)
			.then(({ data }) => {
				view.value = data.totalcount;
			})
			.catch(() => {
				view.value = 0;
			});

		return {
			view,
		};
	},
};
</script>
<style lang=""></style>
