<template>
  <div class="page h-full box-border">
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
    const { options } = currentPage
    const pageConfig = ref({
      params: options,
      backButton: true,
      tabBar: options.tabBar ?? true
    });

    // 分享设置
    definePageConfig({
      enableShareAppMessage: true,
      enableShareTimeline: true,
    });

    return {
      pageConfig,
    };
  },
};
</script>

<style lang="scss"></style>
