<template>
  <swiper class="shadow-md" :circular="true" :interval="3000" :autoplay="true" :loop="true">
    <swiper-item v-for="({ img, link }, key) in data &&
      data.sliders &&
      data.sliders.elements
      ? data.sliders.elements
      : []" :key="key">
      <view class="inner relative w-full h-full" @click="clickItem(link.href)">
        <image mode="aspectFill" class="w-full h-full" :src="imageUrlFix(img.src)" :alt="img.alt" />
        <div class="item-footer absolute inset-x-0 bottom-0 text-white p-sm text-large z-10">
          <div class="text-base z-20">
            {{ link.label }}
          </div>
        </div>
      </view>
    </swiper-item>
  </swiper>
</template>
<script>
import { imageUrlFix } from '@utils/image';
import { gotoPage } from '@utils/index';
export default {
  name: 'carousel-1v5',
  components: {
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    function clickItem(url) {
      gotoPage(url);
    }

    return {
      imageUrlFix,
      clickItem,
    };
  },
};
</script>

<style lang="scss">
swiper {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--border-radius-lg) * 2);
  height: 300px;

  .inner {
    overflow: hidden;
    border-radius: calc(var(--border-radius-lg) * 2);
    height: 300px;

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100px;
      width: 100%;
      background-image: linear-gradient(180deg,
          transparent 0%,
          rgba(0, 0, 0, 0.3) 100%);
    }
  }

  .nut-swiper-pagination {
    :not(.active) {
      opacity: 0.5;
    }
  }
}
</style>
