<template>
  <div class="article">
    <div class="article-meta flex">
      <div class="item" v-for="({ label }, key) in data.meta" :key="key">
        {{ label }} /
      </div>
    </div>
    <div class="body">
      <wxParse :nodes="richtextFixer(data.body)" />
    </div>
  </div>
</template>
<script>
import { richtextFixer } from '@utils/image';
export default {
  name: 'article',
  components: {},
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
    };
  },
};
</script>
<style lang=""></style>
