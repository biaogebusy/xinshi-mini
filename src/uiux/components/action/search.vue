<template>
  <div class="search">
    <nut-searchbar v-model="searchValue" :placeholder="data.placeholder" @search="onSearch">
      <template v-slot:leftin>
        <IconFont name="search2" size="14"></IconFont>
      </template>
      <template v-slot:rightout>
        <div @click="onSearch(searchValue)">
          {{ data.label }}
        </div>
      </template>
    </nut-searchbar>
    <div class="history my-md">
      <div class="header text-base flex justify-between items-center py-sm">
        <div class="title">{{ data.history.title }}</div>
        <div class="actions">
          <div @click="onClear" v-if="history.length > 0">
            全部删除
          </div>
        </div>
      </div>
      <div class="list">
        <nut-tag v-for="(item, key) in history" :key="key" color="#E9E9E9" textColor="#999999" @click="onSearch(item)"
          closeable @close="onClose(item)" type="primary" class="mr-xs">
          {{ item }}
        </nut-tag>
      </div>
      <div class="empty" v-if="!history || history.length === 0">
        无记录
      </div>
    </div>
    <div class="recommend my-md" v-if="data.recommend">
      <div class="title text-base my-sm">
        {{ data.recommend.label }}
      </div>
      <div class="lists">
        <nut-tag v-for="(item, key) in data.recommend.elements" :key="key" @click="onSearch(item)" color="#E9E9E9"
          textColor="#999999" type="primary" class="mr-xs">
          {{ item }}
        </nut-tag>
      </div>
    </div>
    <div class="hot my-md" v-if="data.hot">
      <div class="title text-base my-sm">{{ data.hot.label }}</div>
      <div class="lists bg-white rounded-xl shadow-lg p-md">
        <div class="item text-base my-sm flex" v-for="(item, key) in data.hot.elements" :key="key"
          @click="onSearch(item)">
          <div class="index mr-sm">{{ key + 1 }}</div>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import { setStorageSync, getStorageSync, clearStorageSync } from '@tarojs/taro';
import { gotoPage } from '@utils/index';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'search',
  components: {
    IconFont
  },
  props: {
    data: {
      type: Object,
    },
  },
  setup({ data }) {
    const searchValue = ref('');
    const history = ref([]);

    const onSearch = key => {
      if (key) {
        history.value = [...new Set([...history.value, key])];
        setStorageSync('search', history.value);
        gotoPage(`${data.target}&key=${key}`);
      }
    };

    const onClear = () => {
      clearStorageSync('search');
      history.value = [];
    };

    const onClose = value => {
      history.value.splice(history.value.indexOf(value), 1);
    };

    onMounted(() => {
      history.value = getStorageSync('search');
    });

    return {
      searchValue,
      onSearch,
      history,
      onClear,
      onClose,
    };
  },
};
</script>
<style lang="scss">
.hot {
  .lists {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 50%;

      &:nth-child(1) {
        .index {
          color: var(--danger-color);
        }
      }

      &:nth-child(2) {
        .index {
          color: var(--warning-color);
        }
      }

      &:nth-child(3) {
        .index {
          color: var(--primary-color);
        }
      }
    }
  }
}
</style>
