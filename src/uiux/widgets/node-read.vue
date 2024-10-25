<template>
  <div class="node-read">
    <nut-tag :class="status == '未读' ? 'not' : 'yes'">
      <div>{{ status }}</div>
    </nut-tag>
  </div>
</template>
<script>
import { ref } from 'vue';
import { isFlagged } from '@service';
export default {
  name: 'node-read',
  components: {
  },
  props: {
    entityId: String,
  },
  setup({ entityId }) {
    const status = ref('');
    isFlagged({ type: 'node_read', entityId: entityId }).then(({ data }) => {
      if (data.length > 0) {
        status.value = '已读';
      } else {
        status.value = '未读';
      }
    });

    return {
      status,
    };
  },
};
</script>
<style lang="scss">
.node-read {
  .nut-tag {
    position: relative;
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: #f1f1f1;

    &.yes {
      color: var(--text-color);
    }

    &.not {
      color: var(--primary-color);

      &::after {
        content: '';
        width: 10px;
        height: 10px;
        background-color: var(--danger-color);
        border-radius: 50%;
        position: absolute;
        left: -2px;
        top: -2px;
      }
    }
  }
}
</style>
