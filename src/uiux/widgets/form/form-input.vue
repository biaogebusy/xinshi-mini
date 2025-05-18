<template>
  <input class="nut-input-text" :value="modelValue" :model-value="modelValue" :type="data.mode"
    @input="$emit('update:modelValue', $event.target.value)" :placeholder="data.placeholder"
    :maxlength="getOptionValue('maxLength') || 200" />
</template>
<script>

export default {
  name: 'form-input',
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

    return {
      getOptionValue,
    };
  },
};
</script>
<style lang="scss"></style>
