<template>
  <nut-tabbar bottom placeholder size="23px" unactive-color="var(--tab-bar-color)"
    active-color="var(--tab-bar-active-color)" v-model="tabBarActive" @tab-switch="(item) => {
      navigationStore.SET_TAB_BAR_ACTIVE(item.name);
      switchTab({
        url: item.name,
      });
    }
      ">
    <nut-tabbar-item v-for="(item, key) in options.items" :key="key" :tab-title="item.title" :name="item.name">
      <template #icon="props">
        <IconFont :name="item.icon"></IconFont>
      </template>
    </nut-tabbar-item>
  </nut-tabbar>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { switchTab } from '@tarojs/taro';
import { storeToRefs } from 'pinia';
import { useNavigationStore } from '@store/navigation';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'custom-tab-bar',
  components: {
    IconFont,
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    const active = ref('home');
    const navigationStore = useNavigationStore();
    const { tabBarActive } = storeToRefs(navigationStore);

    onMounted(() => {
      // console.log("page1 mounted");
    });

    onUnmounted(() => {
      // console.log("page1 unmounted");
    });

    return {
      active,
      switchTab,
      tabBarActive,
      navigationStore,
    };
  },
};
</script>

<style lang="scss">
.nut-tabbar {
  border-bottom: none;
  padding: var(--spacing-sm) 0;
}

.nut-tabbar-item_icon-box_nav-word {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}
</style>
