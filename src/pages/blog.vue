<template>
	<div class="page-blog h-full box-border">
		<dynamic-page :options="pageConfig"></dynamic-page>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { definePageConfig } from '@tarojs/taro';
import DynamicPage from '@uiux/dynamic-page.vue';

export default {
	name: 'page-blog',
	components: {
		DynamicPage,
	},
	setup() {
		const pageConfig = ref({
			params: {
				url: '/mini/blog',
			},
			backButton: true,
			tabBar: true,
		});

		// 分享设置
		definePageConfig({
			enableShareAppMessage: true,
			enableShareTimeline: true,
		});

		onMounted(() => {});

		return {
			pageConfig,
		};
	},
};
</script>

<style lang="scss"></style>
