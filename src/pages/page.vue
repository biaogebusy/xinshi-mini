<template>
  <div class="page h-full box-border" :class="pagePath">
    <dynamic-page :options="pageConfig" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { getCurrentPages, definePageConfig } from '@tarojs/taro';
import DynamicPage from '@uiux/dynamic-page.vue';
export default {
  name: 'page',
  components: {
    DynamicPage,
  },
  setup() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { options } = currentPage;
    const pagePath = `page-${options.url.replace(/\//g, '-')}`
    const pageConfig = ref({
      params: options,
      backButton: true,
      tabBar: stringToBoolean(options.tabBar) ?? true
    });

    function stringToBoolean(str) {
      if (str === 'true') {
        return true;
      } else if (str === 'false') {
        return false;
      } else {
        return undefined
      }
    }

    // 分享设置
    definePageConfig({
      enableShareAppMessage: true,
      enableShareTimeline: true,
    });

    return {
      pageConfig,
      pagePath
    };
  },
};
</script>

<style lang="scss"></style>
