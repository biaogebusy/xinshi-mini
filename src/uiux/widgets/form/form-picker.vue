<template>
  <nut-cell style="padding:0 4px;height:22px" :title="title" @click="onShow"></nut-cell>
</template>
<script>
import { ref, onMounted, watch } from 'vue'
import { GET } from '@service/http'
export default {
  name: 'form-picker',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    model: {
      type: Object
    }
  },
  emits: ['pickerChange'],
  setup({ data, model }, { emit }) {
    const asyncColumns = ref([]);
    const title = ref(data.placeholder)

    watch(model, () => {
      const key = data.key;
      const optionValue = model[key];
      if (optionValue !== undefined) {
        const option = asyncColumns.value.filter(item => {
          return item.value === optionValue
        })
        title.value = option[0].text
      }
    })

    const getContent = () => {
      GET(data.api).then(({ data }) => {
        asyncColumns.value = data.rows.map(item => {
          return {
            text: item.label,
            value: item.value
          }
        })
      })
    }


    onMounted(() => {
      getContent()
    });

    const onShow = () => {
      emit('pickerChange', {
        isShow: true,
        data: asyncColumns.value,
        key: data.key
      })
    }

    return { onShow, asyncColumns, title };
  }
}
</script>
<style lang="">

</style>