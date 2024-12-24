<template>
  <div class="region h-full"
    :style="`padding-top:${(statusBarHeight ? statusBarHeight : 0) + (navBarHeight ? navBarHeight : 0)}px`">
    <div class="custom-nav-bar w-full" :style="{
          '--status-bar-height': statusBarHeight ? statusBarHeight + 'px' : false,
          '--navbar-height': navBarHeight ? navBarHeight + 'px' : false,
          '--navbar-background': pageConfig.navBarBackground,
          '--navbar-color': pageConfig.navBarColor,
        }">
      <slot name="navbar">
        <custom-navbar :options="pageConfig" :title="data.title" />
      </slot>
    </div>

    <div class="w-full">
      <slot name="components">
        <div v-for="(item, key) in data.body || []" :key="key" :class="[
                  item.classes,
                  item.spacer && item.spacer.x ? `mx-${item.spacer.x}` : 'mx-md',
                  item.spacer && item.spacer.y ? `my-${item.spacer.y}` : 'my-md',
                ]">
          <div class="component-title mb-sm mx-md text-xl font-semibold" v-if="item.blockTitle">
            {{ item.blockTitle.label }}
          </div>
          <dynamic-component :pageConfig="pageConfig" :data="{ content: item, config: data.config, urlParams: urlParams }"
            class="component-body"></dynamic-component>
        </div>
      </slot>
    </div>
    <div class="custom-tab-bar w-full" v-if="pageConfig.tabBar === undefined ? tabBar : pageConfig.tabBar">
      <slot name="tabbar">
        <custom-tab-bar :options="tabbarOptions" />
      </slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, provide, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import {
  showLoading,
  hideLoading,
  eventCenter,
  getSystemInfoSync,
  getCurrentInstance,
  setNavigationBarColor,
  showToast,
} from '@tarojs/taro';
import { useNavigationStore } from '@store/navigation';
import { useUserStore } from '@store/user';
import {
  loadLandingPage,
  statistics,
  loadBaseConfig,
  shareWX,
  gotoLogin
} from '@service/index';
import { checkWxUpdate } from '@utils/index';
import CustomNavbar from '@uiux/components/navigation/custom-navbar.vue';
import CustomTabBar from '@uiux/components/navigation/custom-tabbar.vue';
import DynamicComponent from '@uiux/dynamic-component.vue'
export default {
  name: 'dynamic-page',
  components: {
    DynamicComponent,
    CustomNavbar,
    CustomTabBar,
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup({ options }) {
    const data = ref({});
    const urlParams = ref(options.params);
    const coreConfig = ref({});
    const tabbarOptions = ref({});
    const statusBarHeight = ref(0);
    const navBarHeight = ref(0);
    const navigationStore = useNavigationStore();
    const userStore = useUserStore();
    const profile = computed(() => userStore.profile || null);
    const { navBarBackground, navBarColor, tabBar } = storeToRefs(
      navigationStore,
    );
    let pageConfig = reactive({
      backButton: true,
    });

    pageConfig = Object.assign(pageConfig, options);

    setNavigationBarColor({
      backgroundColor: 'transparent',
      frontColor: options.navBarColor || '#ffffff',
    });

    showLoading();
    loadBaseConfig().then(({ data }) => {
      const { guard } = data;
      coreConfig.value = data;
      userStore.setCoreConfig(data);
      tabbarOptions.value = data.tabbar;
      if (guard && guard.authGuard) {
        if (urlParams.value.url === '/mini/login' || profile.value) {
          return
        } else {
          gotoLogin();
        }
      }
    });
    provide('coreConfig', coreConfig);
    loadLandingPage(options.params.url)
      .then(res => {
        const config = res.data.config;
        if (config) {
          pageConfig = Object.assign(pageConfig, config);
        }
        hideLoading();
        data.value = res.data;
        if (config && config.node && config.node.entityId) {
          statistics(config.node.entityId);
        }
      })
      .catch(err => {
        hideLoading();
        console.log(err);

        if (err.errMsg === 'request:fail timeout') {
          showToast({
            icon: 'error',
            title: '服务器繁忙',
          });
        }
      });

    // component onShow
    eventCenter.on(getCurrentInstance().router.onShow, () => {
      navigationStore.SET_TITLE(data.value.title || '');
    });

    onMounted(() => {
      shareWX();
      checkWxUpdate();
      const sysInfo = getSystemInfoSync();
      // console.log(JSON.stringify(sysInfo, null, 2));
      // console.log('onMounted');

      // 设置设备状态栏高度留白
      statusBarHeight.value = sysInfo.statusBarHeight;

      // 判断是 IOS 还是 Android
      if (sysInfo.system.indexOf('iOS') > -1) {
        // console.log('is iOS');
        navBarHeight.value = 44;
      } else if (sysInfo.system.indexOf('Android') > -1) {
        // console.log('is Android');
        navBarHeight.value = 44;
      } else {
        // console.log('is Others');
        navBarHeight.value = 46;
      }

      // 检测用户资料是否过期
      if (profile.value) {
        userStore.checkDrupalUserState();
      }
    });

    return {
      data,
      statusBarHeight,
      navBarBackground,
      navBarHeight,
      navBarColor,
      tabBar,
      urlParams,
      tabbarOptions,
      pageConfig,
    };
  },
};
</script>
<style lang="scss">
.custom-nav-bar {
  padding-top: var(--status-bar-height);
  background: var(--navbar-background);
  position: fixed;
  top: 0;
  z-index: 999;
}
</style>
