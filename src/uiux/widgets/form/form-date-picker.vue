<template>
  <nut-input class="nut-input-text" :value="date" :model-value="date" type="string" :placeholder="data.placeholder"
    @click="show = true" />
  <nut-popup v-model:visible="show" position="top">
    <nut-date-picker v-model="val" :three-dimensional="false" @confirm="confirm"></nut-date-picker>
  </nut-popup>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'form-date-picker',
  components: {
  },
  props: {
    data: {
      type: Object,
    },
    modelValue: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup({ data }, { emit }) {
    const show = ref(false)
    const date = ref('')
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const val = ref(new Date(year, month, day))

    const confirm = ({ selectedValue }) => {
      const { options } = data
      let value = selectedValue.join('-')
      date.value = value
      if (options && options.returnFormat && options.returnFormat === 'timestamp') {
        // 秒
        value = new Date(value).getTime() / 1000;
        emit('update:modelValue', value)
      } else {
        emit('update:modelValue', value)
      }
      show.value = false
    }

    return {
      show,
      date,
      confirm,
      val
    };
  },
};
</script>
<style lang="scss"></style>
