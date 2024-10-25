<template>
  <div class="card-1v0">
    <div class="card-item">
      <div class="item-image relative" @click="gotoPage(data.href)">
        <image class="w-full" :src="imageUrlFix(data.img.src)" :alt="data.img.alt" :lazyLoad="true"
          :mode="'aspectFill'" />

        <div class="item-footer absolute inset-x-0 bottom-0 text-white p-sm text-md">
          {{ data.label }}
        </div>
      </div>
      <div class="item-body flex justify-between items-center mt-sm">
        <div class="item-title text-md font-semibold text-primary truncate">
          {{ data.subTitle }}
        </div>
        <div class="item-date text-lighter whitespace-nowrap">
          {{ dateFormat(data.date.start, 'Y/m/d') }} -
          {{ dateFormat(data.date.end, 'Y/m/d') }}
        </div>
      </div>
      <div class="item-info flex justify-between items-center mt-sm">
        <div class="flex items-center">
          <div class="info-image mr-sm">
            <image class="media" :src="imageUrlFix(data.store.src)" :alt="data.store.alt" :lazyLoad="true"
              mode="aspectFit" />
          </div>
          <div class="whitespace-nowrap">{{ data.store.name }}</div>
        </div>
        <div class="flex items-center">
          <div class="mr-md flex items-center">
            <IconFont name="eye" size="16" class="mr-sm" />
            <node-view :nid="data.id" />
          </div>
          <node-read :entityId="data.id" />
        </div>
      </div>
      <nut-divider />
    </div>
  </div>
</template>
<script>
import { imageUrlFix } from '@utils/image';
import NodeView from '@uiux/widgets/node-view.vue';
import NodeRead from '@uiux/widgets/node-read.vue';
import { dateFormat } from '@utils/index';
import { gotoPage } from '@utils/index';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'card-1v0',
  components: {
    IconFont,
    NodeView,
    NodeRead,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    return {
      imageUrlFix,
      dateFormat,
      gotoPage,
    };
  },
};
</script>
<style lang="scss">
.card-1v0 {
  .card-item {
    .nut-divider {
      color: var(--border-color);
      opacity: 0.5;
    }

    .item-image {
      border-radius: var(--border-radius-lg);
      overflow: hidden;

      &:after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: 6px;
        height: 80px;
        width: 100%;
        border-radius: var(--border-radius-lg);
        background-image: linear-gradient(180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.4) 100%);
      }

      image {
        border-radius: var(--border-radius-lg);
        height: 300px;
      }

      .item-footer {
        z-index: 1;
        border-radius: var(--border-radius-lg);
      }
    }

    .item-info {
      .info-image {
        .media {
          height: 50px;
          width: 60px;
        }
      }
    }
  }
}
</style>
