<template>
	<div
		class="dynamic-widget flex flex-wrap"
		:style="data.style"
		:class="data.classes"
	>
		<component
			v-for="(item, key) in data.elements"
			:key="key"
			:is="item.type === 'text' ? 'base-text' : item.type"
			:style="item.style"
			:data="item"
		></component>
	</div>
</template>
<script>
import BaseText from './base-text.vue';
import UiImg from './ui-img.vue';
export default {
	name: 'dynamic-widget',
	components: {
		BaseText,
		UiImg,
	},
	props: {
		data: {
			type: Object,
		},
	},
};
</script>
<style lang="scss"></style>
