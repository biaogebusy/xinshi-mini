<template>
  <div class="notice-bar">
    <div class="inner flex items-center justify-start shadow-sm rounded-lg">
      <image class="left-icon ml-4" mode="aspectFit" style="width: 40px;height: 40px;"
        :src="imageUrlFix(data.options.leftIcon)" />
      <nut-noticebar background="transparent" direction="vertical" :height="50" :speed="10" :standTime="3000" :list="[]"
        :color="data.options.color" :scrollable="false" class="flex-auto">
        <div class="flex" :data-index="index" v-for="(item, index) in data.elements" :key="index"
          @click="gotoPage(item.url)">
          <div class="title flex-auto">{{ item.label }}</div>
          <div class="right text-gray-300">{{ item.right }}</div>
        </div>
      </nut-noticebar>
    </div>
  </div>
</template>

<script>
import { gotoPage } from '@utils/index';
import { imageUrlFix } from '@utils/image';
export default {
  name: 'notice-bar',
  components: {
  },
  props: {
    data: {
      type: Object,
      default() { },
    },
  },
  setup(props) {
    return { imageUrlFix, gotoPage };
  },
};
</script>
<style lang="scss">
.notice-bar {
  .inner {
    background-color: #fff;
  }
}
</style>
