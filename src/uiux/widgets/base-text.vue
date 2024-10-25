<template>
	<div
		class="base-text"
		:class="data.classes || ''"
		:style="data.style || ''"
		@click="onClick"
	>
		<div
			class="title text-lg mb-md"
			v-if="data.title"
			:class="data.title.classes"
		>
			{{ data.title.label }}
		</div>
		<rich-text
			v-if="data.body"
			:user-select="true"
			:nodes="richtextFixer(data.body)"
		></rich-text>
	</div>
</template>
<script>
import { richtextFixer } from '@utils/image';
import { gotoPage } from '@utils/index';
export default {
	// Do not use built-in element id: text
	name: 'base-text',
	components: {},
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	setup({ data }) {
		const onClick = () => {
			const params = data.params;
			if (params && params.callPhone) {
				wx.makePhoneCall({
					phoneNumber: params.phoneNumber,
				});
			}

			if (params && params.link) {
				gotoPage(params.link);
			}
		};
		return { richtextFixer, onClick };
	},
};
</script>
<style lang="scss">
.text-align-left {
	text-align: left;
}
.text-align-right {
	text-align: right;
}
.text-align-center {
	text-align: center;
}
.text-align-justify {
	text-align: justify;
}
</style>
