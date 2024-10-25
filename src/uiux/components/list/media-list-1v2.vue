<template>
	<div class="media-list-1v2 overflow-hidden bg-white shadow-sm rounded-lg">
		<nut-grid :column-num="data.params.num || 4" :border="data.params.border">
			<nut-grid-item
				v-for="(item, key) in data.elements"
				:key="key"
				@click="gotoPage(item.url)"
			>
				<div
					class="media box-border mb-xs rounded-full p-xs flex items-center justify-center"
					style="width: 50px; height: 50px"
					:style="item.style"
				>
					<image
						mode="aspectFit"
						style="width: 50px; height: 50px"
						:src="imageUrlFix(item.img)"
					></image>
				</div>
				<div class="title">{{ item.label }}</div>
			</nut-grid-item>
		</nut-grid>
	</div>
</template>
<script>
import { gotoPage } from '@utils/index';
import { imageUrlFix } from '@utils/image';
export default {
	name: 'media-list-1v2',
	components: {},
	props: {
		data: {
			type: Object,
		},
	},
	setup() {
		return {
			gotoPage,
			imageUrlFix,
		};
	},
};
</script>
<style lang="scss">
.media-list-1v2 {
	.nut-grid-item__content {
		background-color: transparent;
	}
}
</style>
