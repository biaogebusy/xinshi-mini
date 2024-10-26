<template>
	<div
		class="card-1v1 flex gap-4 rounded-2xl overflow-hidden bg-white showdow-lg my-4"
		@click="gotoPage(data.url)"
	>
		<div class="w-4/12 relative">
			<image
				v-if="data.img"
				class="w-full h-full object-cover"
				:src="imageUrlFix(data.img)"
				:lazyLoad="true"
				:mode="'aspectFill'"
			/>
			<image
				v-if="!data.img"
				class="w-full h-full object-cover"
				:src="imageUrlFix(coreConfig.defaultCover)"
				:lazyLoad="true"
				:mode="'aspectFill'"
			/>
		</div>
		<div class="w-8/12 flex flex-col gap-2 py-3 pr-3">
			<div class="text-gray-400">{{ data.type }}</div>
			<div class="text-md text-black-500">{{ data.title }}</div>
			<div class="flex gap-1">
				<image
					class="rounded-full w-5 h-5 object-cover"
					:src="imageUrlFix(data.picture)"
					:lazyLoad="true"
					:mode="'aspectFill'"
				/>
				{{ data.user }}
				<div class="text-gray-400">{{ data.created }}</div>
			</div>
		</div>
	</div>
</template>
<script>
import { inject } from 'vue';
import { imageUrlFix } from '@utils/image';
import { gotoPage } from '@utils/index';
export default {
	name: 'card-1v1',
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	setup(props) {
		const coreConfig = inject('coreConfig');
		return {
			imageUrlFix,
			gotoPage,
			coreConfig,
		};
	},
};
</script>
