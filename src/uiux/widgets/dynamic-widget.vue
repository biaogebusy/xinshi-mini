<template>
  <div class="dynamic-widget" :class="data.content?.classes">
    <component :is="data.type === 'text' ? 'base-text' : data.type" :style="data.content?.style" :data="data.content">
    </component>
  </div>
</template>
<script>
import BaseText from './base-text.vue';
import UiImg from './ui-img.vue';
import card1v1 from '@uiux/widgets/card/card-1v1.vue';
export default {
  name: 'dynamic-widget',
  components: {
    BaseText,
    UiImg,
    card1v1,
  },
  props: {
    data: {
      type: Object,
    },
  },
};
</script>
<style lang="scss"></style>
