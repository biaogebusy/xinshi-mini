<template>
  <div class="media-list-1v1" v-if="!loading">
    <Scroller :triggered="triggered" :hasMore="customHasMore" :isEnd="isEnd" :loading="loadMore" :height="height"
      @loadMore="onLoadMore" @refresh="onRefresh">
      <template #content>
        <div class="p-md" v-if="customList.length > 0">
          <div class="item flex items-center" v-for="item in customList" :key="item.id" :id="item.key">
            <div class="media mr-md flex items-center justify-center">
              <image mode="aspectFit" :src="imageUrlFix(item.src || data.defImg)" style="width:24px;height:24px"
                :lazyLoad="true"></image>
            </div>
            <div class="content flex-auto flex items-center py-md">
              <div class="left flex-auto">
                <div class="title text-sm">{{ item.title }}</div>
                <div class="sub-title text-xs text-gray-400">
                  {{ item.subTitle }}
                </div>
              </div>
              <div class="right whitespace-nowrap flex flex-col items-end">
                <div class="text-base" :style="data.labelStyle">
                  {{ item.rightLabel }}
                </div>
                <div class="sub-label text-gray-400 text-xs" v-if="item.rightSubLabel">
                  {{ item.rightSubLabel }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <empty v-else />
      </template>
    </Scroller>
  </div>
  <div class="m-md flex justify-center" v-else>
    <nut-skeleton width="350px" height="20px" title animated row="10"></nut-skeleton>
  </div>
</template>
<script>
import { imageUrlFix } from '@utils/image';
import { ref, reactive, onMounted, toRefs } from 'vue';
import { GET } from '@service/http';
import { getSystemInfoSync } from '@tarojs/taro';
import Empty from '@widgets/empty.vue';
import Scroller from '@uiux/widgets/scroller.vue';
export default {
  name: 'media-list-1v1',
  components: {
    empty: Empty,
    Scroller,
  },
  props: {
    data: {
      type: Object,
      default() { },
    },
  },
  setup({ data }) {
    const currentPage = ref(0);
    const loading = ref(false);
    const loadMore = ref(false);
    const triggered = ref(false);

    const customHasMore = ref(true);
    const isEnd = ref(false);
    const content = reactive({
      customList: [],
      height: '',
    });

    const onLoadMore = () => {
      if (customHasMore.value && !loadMore.value) {
        loadMore.value = true;
        getContent(currentPage.value + 1);
      }
    };
    const onRefresh = e => {
      triggered.value = true;
      setTimeout(() => {
        getContent();
      }, 500);
    };

    const init = () => {
      loading.value = true;
      getContent();
    };

    const getContent = (pager = 0) => {
      if (data.params && data.params.api) {
        GET(`${data.params.api}?page=${pager}&noCache=1`)
          .then(({ data }) => {
            if (pager === 0) {
              content.customList = [];
            }
            content.customList = content.customList.concat(data.rows);
            loading.value = false;
            loadMore.value = false;
            triggered.value = false;
            currentPage.value = data.pager.current_page;
            if (data.pager.total_items === 0) {
              isEnd.value = false;
              customHasMore.value = false;
              return;
            }
            if (content.customList.length === data.pager.total_items) {
              isEnd.value = true;
              customHasMore.value = false;
            } else {
              isEnd.value = false;
              customHasMore.value = true;
            }
          })
          .catch(error => {
            loading.value = false;
            loadMore.value = false;
            triggered.value = false;
            console.log(error);
          });
      } else {
        content.customList = data.elements;
      }
    };
    onMounted(() => {
      const sysInfo = getSystemInfoSync();
      const safeArea = sysInfo.safeArea;
      content.height =
        safeArea.height - sysInfo.statusBarHeight - safeArea.top + 'px';
      init();
    });
    return {
      imageUrlFix,
      loading,
      loadMore,
      isEnd,
      onRefresh,
      triggered,
      customHasMore,
      onLoadMore,
      ...toRefs(content),
    };
  },
};
</script>
<style lang="scss">
.media-list-1v1 {
  .item {
    .media {
      width: 80px;
      height: 80px;
      flex: 0 0 80px;
      border-radius: 50%;
      background-color: rgb(var(--primary-color-rgb) / 0.2);
    }

    .content {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        height: 1px;
        width: 100%;
        opacity: 0.5;
        background-color: var(--border-color);
      }
    }
  }
}
</style>
