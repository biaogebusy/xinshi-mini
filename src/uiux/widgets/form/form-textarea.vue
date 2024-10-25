<template>
  <nut-textarea class="nut-textarea__textarea custom-textarea" :rows="2" :value="modelValue" :model-value="modelValue"
    :maxlength="getOptionValue('maxLength') || 200" :minlength="getOptionValue('minLength') || 0"
    :placeholder="data.placeholder" @input="$emit('update:modelValue', $event.target.value)" />
</template>
<script>
export default {
  name: 'form-textarea',
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
  setup({ data }) {
    function getOptionValue(key) {
      if (data.options) {
        return data.options[key];
      } else {
        return null;
      }
    }

    return { getOptionValue };
  },
};
</script>
<style lang="scss">
.custom-textarea {
  background: var(--background-color-lighter);
  border-radius: 4px;
}
</style>
