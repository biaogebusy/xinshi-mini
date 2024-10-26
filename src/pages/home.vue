<template>
	<div class="page-home brand-header-bg h-full box-border">
		<dynamic-page :options="pageConfig">
			<template #navbar>
				<nut-navbar
					placeholder
					:left-show="false"
					:style="{ paddingRight: pr }"
				>
					<template #left>
						<div class="user-profile flex-none flex items-center px-xs">
							<div @click="gotoLogin()" v-if="!profile">
								<image
									class="rounded-full user-picture"
									:style="{ height: height, width: height }"
									:src="avatar"
									mode="aspectFit"
								/>
							</div>
							<div v-if="profile" @click="gotoPage('tab=/pages/user')">
								<image
									class="rounded-full user-picture"
									:style="{ height: height, width: height }"
									:src="imageUrlFix(profile.avatar) || avatar"
									mode="aspectFit"
								/>
							</div>
						</div>
						<div
							class="searchbar flex-auto min-w-0 flex items-center"
							:style="{ height: height }"
						>
							<nut-searchbar
								v-model="keyword"
								placeholder="请输入关键词"
								@click="gotoPage('/mini/search')"
								:style="{ height: height }"
							>
								<template #leftin>
									<IconFont
										size="14"
										name="search"
										color="var(--text-color)"
									></IconFont>
								</template>
								<template v-slot:rightin>
									<IconFont
										@click.stop="onScan"
										style="padding:10px;"
										size="14"
										name="scan2"
										color="var(--text-color)"
									></IconFont>
								</template>
							</nut-searchbar>
						</div>
					</template>
				</nut-navbar>
			</template>
		</dynamic-page>
	</div>
</template>

<script>
import { ref, toRefs, reactive, computed, onMounted } from 'vue';
import { definePageConfig, switchTab } from '@tarojs/taro';
import { useUserStore } from '@store/user';
import { gotoLogin } from '@service/index';
import avatar from '@images/user/avatar.png';
import CustomNavbar from '@uiux/components/navigation/custom-navbar.vue';
import DynamicPage from '@uiux/dynamic-page.vue';
import { imageUrlFix } from '@utils/image';
import { gotoPage, getUserLocation } from '@utils/index';
import { IconFont } from '@nutui/icons-vue-taro';

export default {
	name: 'page-home',
	components: {
		DynamicPage,
		CustomNavbar,
		IconFont,
	},
	setup(options) {
		const toolbarStyle = reactive({
			height: '',
			pr: '',
		});
		const pageConfig = ref({
			params: {
				url: '/mini/home',
			},
			backButton: false,
			tabBar: true,
		});
		const userStore = useUserStore();
		const profile = computed(() => userStore.profile || null);
		const keyword = ref('');
		const { height, width } = wx.getMenuButtonBoundingClientRect();
		toolbarStyle.height = `${height}px`;
		toolbarStyle.pr = `${width + 10}px`;
		definePageConfig({
			enableShareAppMessage: true,
			enableShareTimeline: true,
		});

		const search = () => {
			console.log(keyword.value);
		};

		const onScan = () => {
			wx.scanCode({
				success({ path }) {
					console.log(path);
					gotoPage(path);
				},
			});
		};

		onMounted(() => {
			getUserLocation();
		});

		return {
			pageConfig,
			profile,
			gotoLogin,
			avatar,
			keyword,
			search,
			imageUrlFix,
			switchTab,
			gotoPage,
			onScan,
			...toRefs(toolbarStyle),
		};
	},
};
</script>
<style lang="scss">
.page-home {
	position: relative;
	overflow-x: hidden;

	.user-picture {
		width: calc(var(--navbar-height) - var(--spacing-sm));
	}

	.page-navbar {
		padding-left: var(--spacing-md);
		padding-right: calc(190px + var(--spacing-md));
		padding-top: var(--spacing-xs);
		padding-bottom: var(--spacing-xs);
	}

	.nut-navbar__title {
		display: none;
	}

	.nut-navbar__right {
		display: none;
	}

	.nut-searchbar {
		padding: var(--spacing-xs) 0;
		height: calc(var(--navbar-height) - var(--spacing-sm));
		box-sizing: border-box;
		border-radius: 999px;

		.nut-searchbar__search-input {
			width: 100%;
			box-sizing: border-box;

			input {
				min-width: auto;
				padding-right: 0;
			}
		}
	}

	.message {
		.nut-badge__content {
			background: var(--danger-color);
			color: #fff;
		}

		.nut-icon {
			font-size: 20px;
			color: var(--text-color);
		}
	}
}
</style>
