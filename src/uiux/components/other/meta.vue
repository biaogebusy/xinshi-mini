<template>
	<div class="meta text-center flex flex-col my-md mx-md">
		<div class="inner flex-auto">
			<image
				class="logo my-md"
				mode="widthFix"
				style="width: 80px;height: 80px;"
				:src="data.logo"
			/>
			<div class="font-bold text-xl my-md">{{ data.slogan }}</div>
			<div class="items">
				<div
					class="flex mb-sm text-base"
					v-for="(item, key) in data.meta"
					:key="key"
				>
					<div class="label  text-gray-400">{{ item.label }}</div>
					<div class="value">{{ item.value }}</div>
				</div>
			</div>
		</div>
		<div class="bottom flex-none my-xs text-gray-400">
			<div>{{ data.bottom.name }}</div>
			<div>{{ data.bottom.copyright }}</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'meta',
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
};
</script>
<style lang="scss">
.meta {
	height: 85vh;
}

.label {
	min-width: 100px;
	text-align: left;
}
</style>
