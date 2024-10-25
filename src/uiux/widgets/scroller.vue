<template>
  <scroll-view :scroll-y="true" :refresher-enabled="true" :refresher-triggered="triggered" :show-scrollbar="false"
    :style="`width: 100%; height: ${height}`" @refresherrefresh="$emit('refresh')">
    <slot name="top"></slot>
    <slot name="filter"></slot>
    <slot name="content"></slot>
    <div class="has-more text-center text-md" v-if="hasMore">
      <div class="flex justify-center py-md" @click="$emit('loadMore')">
        <IconFont name="loading1" v-if="loading"></IconFont>
        点击加载更多
      </div>
      <div class="text-slate-400 py-md" v-if="isEnd">已到底</div>
    </div>
  </scroll-view>
</template>
<script>
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'scroller',
  components: {
    IconFont
  },
  props: {
    triggered: {
      type: Boolean,
      default() {
        return false;
      },
    },
    height: {
      type: String,
      default() {
        return '100%';
      },
    },
    hasMore: {
      type: Boolean,
    },
    isEnd: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  setup() { },
};
</script>
<style lang="scss">
scroll-view {
  // ::-webkit-scrollbar {
  // 	background: transparent;
  // 	color: transparent;
  // 	display: none;
  // 	height: 0;
  // 	opacity: 0;
  // 	width: 0;
  // }
}
</style>
