<template>
  <nut-navbar placeholder :left-show="false">
    <template #left>
      <slot name="left">
        <IconFont name="left" v-if="options.backButton === undefined ? backButton : options.backButton
          " size="var(--font-size-md)" @click="() => {
    goBack();
  }
    "></IconFont>
      </slot>
    </template>
    <template #content>
      <slot name="content">
        <text class="title" v-if="options.showTitle === undefined ? true : options.showTitle">
          {{ title || headerTitle }}
        </text>
      </slot>
    </template>
    <template #right>
      <slot name="right"></slot>
    </template>
  </nut-navbar>
</template>
<script>
import { IconFont } from '@nutui/icons-vue-taro';
import { onMounted } from 'vue';
import { navigateBack } from '@tarojs/taro';
import { storeToRefs } from 'pinia';
import { useNavigationStore } from '@store/navigation';
import { getCurrentPages } from '@tarojs/taro';
import { gotoPage } from '@utils/index';
export default {
  name: 'custom-navbar',
  components: {
    IconFont
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
  },
  setup(props) {
    const navigationStore = useNavigationStore();
    const { title: headerTitle, backButton } = storeToRefs(navigationStore);

    const goBack = () => {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        navigateBack();
      } else {
        gotoPage('tab=home');
      }
    };

    onMounted(() => {
      // console.log(`CustomNavBar Mounted`);
    });

    return {
      props,
      headerTitle,
      backButton,
      goBack,
    };
  },
};
</script>

<style lang="scss">
.nut-navbar {
  margin-bottom: 0;
  background: transparent;
  box-shadow: none;
  padding-left: var(--spacing-md);
}

.nut-navbar__title {
  padding-left: var(--spacing-xs);
  padding-right: var(--spacing-xs);

  .title {
    color: var(--navbar-color);
    font-weight: bold;
  }
}

.nut-navbar__left {
  color: var(--navbar-color);
  padding-left: var(--spacing-xs);
  padding-right: var(--spacing-xs);
}
</style>
