<template>
  <div class="article">
    <div class="banner">
      <image v-if="data?.banner?.img?.src" class="w-full object-cover" :src="imageUrlFix(data.banner.img.src)"
        :lazyLoad="true" :mode="'aspectFill'" />
    </div>
    <div class="bg-white rounded-4xl p-6 relative z-10 -mt-8 flex flex-col gap-4">
      <div class="title text-xl text-gray-900">{{ data.title }}</div>
      <div class="flex gap-2 text-xs text-gray-400">
        <div class="flex items-center gap-1">
          <IconFont size="12" name="clock" /> {{ data.meta[0].label }}
        </div>
      </div>
      <div class="body">
        <wxParse :nodes="richtextFixer(data.body)" />
        <div class="h-16"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { imageUrlFix } from '@utils/image';
import { richtextFixer } from '@utils/image';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'article',
  components: {
    IconFont
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup({ data }) {
    return {
      richtextFixer,
      imageUrlFix
    };
  },
};
</script>
<style lang="scss">
.article {
  margin: -40px -40px 0 -40px;
}
</style>
