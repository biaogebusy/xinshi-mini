<template>
  <div class="dynamic-scroller relative" v-if="!loading">
    <nut-popup v-if="data.search && data.search.filter" pop-class="box-border" position="top" v-model:visible="show"
      :style="{ padding: '50px 20px 20px' }">
      <dynamic-form @modalChange="onModalChange" :data="data.search.filter"></dynamic-form>
    </nut-popup>
    <template v-if="data.search">
      <div class="search flex justify-between items-center fixed left-0 right-0 z-100 bg-white shadow-sm px-4 py-2">
        <div class="left flex items-center gap-3">
          <nut-button size="small" @click="show = true" type="default">{{ data.search.label }}
            <template #icon>
              <IconFont name="rect-down"></IconFont>
            </template>
          </nut-button>
          <IconFont @click="reset" name="close" size="14"></IconFont>
        </div>
        <div class="right">
          已加载{{ customList.length }}条数据
        </div>
      </div>
    </template>
    <Scroller :triggered="triggered" :hasMore="customHasMore" :isEnd="isEnd" :loading="loadMore" :height="height"
      @loadMore="onLoadMore" @refresh="onRefresh">
      <template #top>
        <div v-if="data.search" style="height:44px"></div>
        <slot name="top"></slot>
      </template>
      <template #content>
        <div class="relative" v-if="customList.length > 0">
          <dynamic-widget :data="{ type: data.params.widget, content: item }" v-for="(item, key) in customList"
            :key="key"></dynamic-widget>
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
import { ref, reactive, onMounted, toRefs, computed } from 'vue';
import { GET } from '@service/http';
import Empty from '@widgets/empty.vue';
import { useUserStore } from '@store/user';
import { gotoLogin } from '@service/index';
import { toQueryString } from '@utils/common';
import { getSystemInfoSync } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import Scroller from '@uiux/widgets/scroller.vue';
import dynamicWidget from '@uiux/widgets/dynamic-widget.vue';
import dynamicForm from '@uiux/components/form/dynamic-form.vue';
export default {
  name: 'dynamic-scroller',
  components: {
    empty: Empty,
    Scroller,
    IconFont,
    dynamicForm,
    dynamicWidget,
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
    const show = ref(false);

    const customHasMore = ref(true);
    const isEnd = ref(false);
    const content = reactive({
      customList: [],
      height: '',
      searchParams: {},
    });

    const getWidgetData = item => {
      return {
        type: data.params.widget,
        content: item,
      };
    };

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

    const reset = () => {
      content.searchParams = {};
      content.page = 0;
      getContent();
    };

    const onModalChange = value => {
      console.log(value);
      show.value = false;
      content.searchParams = value;
      getContent();
    };

    const getContent = (pager = 0) => {
      if (data.params && data.params.api) {
        let options = {
          page: pager,
          noCache: 1,
          ...content.searchParams,
        };
        if (data.params.query) {
          const query = data.params.query;
          Object.keys(query).map(key => {
            if (query[key].includes('{id}')) {
              const userStore = useUserStore();
              const profile = computed(() => userStore.profile || null);
              const token = computed(() => userStore.token || null);
              if (!profile.value && !token.value) {
                gotoLogin();
              }
              query[key] = query[key].replace('{id}', profile.value.uid);
            }
          });
          options = Object.assign(options, query);
        }
        const query = toQueryString(options);
        GET(`${data.params.api}?${query}`)
          .then(({ data }) => {
            if (pager === 0) {
              content.customList = [];
            }
            content.customList = content.customList.concat(data.rows ?? []);
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
            wx.showModal({
              title: '温馨提示',
              content: error.data.message,
            });
          });
      } else {
        content.customList = data.elements;
      }
    };
    onMounted(() => {
      const sysInfo = getSystemInfoSync();
      const { height, top } = sysInfo.safeArea;
      content.height =
        height - sysInfo.statusBarHeight - top + 'px';
      init();
    });
    return {
      show,
      isEnd,
      reset,
      loading,
      loadMore,
      onRefresh,
      triggered,
      onLoadMore,
      getWidgetData,
      customHasMore,
      onModalChange,
      ...toRefs(content),
    };
  },
};
</script>
<style lang="scss"></style>
