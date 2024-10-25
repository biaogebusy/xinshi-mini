<template>
  <nut-radio-group @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" :model-value="modelValue"
    direction="horizontal">
    <nut-radio v-for="(item, key) in data.options" :key="key" :label="item.value">{{ item.label }}</nut-radio>
  </nut-radio-group>
</template>

<script>
export default {
  name: 'form-radio',
  props: {
    data: {
      type: Object
    }
  }
}
</script>

<style lang="scss"></style>