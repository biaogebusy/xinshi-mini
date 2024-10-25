<template>
  <div class="page-user h-full box-border">
    <dynamic-page :options="pageConfig"></dynamic-page>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { definePageConfig } from '@tarojs/taro';
import DynamicPage from '@uiux/dynamic-page.vue';

export default {
  name: 'page-user',
  components: {
    DynamicPage,
  },
  setup() {
    const pageConfig = ref({
      params: {
        url: '/mini/my',
      },
      backButton: false,
      tabBar: true,
      navBarBackground: 'transparent',
      navBarColor: '#000000',
    });

    definePageConfig({
      enableShareAppMessage: true,
      enableShareTimeline: true,
    });

    onMounted(() => {
    })
    return {
      pageConfig,
    };
  },
};
</script>

<style lang="scss">
.page-user {
  background-image: linear-gradient(180deg,
      var(--primary-color) 0%,
      #fcfefd 40%,
      transparent 50%,
      transparent 100%);
}
</style>
