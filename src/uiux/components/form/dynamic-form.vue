<template>
  <view class="dynamic-form">
    <bg :style="data.bg.style" v-if="data.bg" />
    <nut-form :model-value="formState" ref="dynamicRefForm">
      <nut-form-item v-for="(item, index) in data.form" :key="index" :label="item.label" :prop="item.key"
        :required="item.options && item.options.required" :rules="item.rules || []">
        <component v-model="formState[item.key]" :model="formState" :data="item" :is="`form-${item.type}`"
          @uploadChange="onUploadChange" @pickerChange="onPickerChange">
        </component>
      </nut-form-item>
      <nut-cell>
        <div class="flex justify-center w-full">
          <nut-button v-for="(item, key) in data.actions" :key="key" :type="item.color" :size="item.size || 'normal'"
            style="margin-right: 10px" @click="onAction(item)">
            {{ item.label }}
          </nut-button>
        </div>
      </nut-cell>
    </nut-form>
    <nut-popup position="bottom" v-model:visible="show">
      <nut-picker :columns="asyncColumns" title="门店" @confirm="popupConfirm" @cancel="show = false"></nut-picker>
    </nut-popup>
  </view>
</template>
<script>
import { ref, reactive } from 'vue';
import Bg from '@widgets/bg.vue';
import FormInput from '@widgets/form/form-input.vue';
import { showToast, navigateBack, showModal } from '@tarojs/taro';
import { submitWebform, addNode } from '@service/index';
import FormRadio from '@uiux/widgets/form/form-radio.vue';
import FormTextarea from '@widgets/form/form-textarea.vue';
import FormUploader from '@widgets/form/form-uploader.vue';
import FormPicker from '@uiux/widgets/form/form-picker.vue';
import FormDatePicker from '@uiux/widgets/form/form-date-picker.vue';
export default {
  name: 'dynamic-form',
  components: {
    FormInput,
    FormRadio,
    FormTextarea,
    FormUploader,
    FormPicker,
    FormDatePicker,
    bg: Bg,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['modalChange'],
  setup({ data }, { emit }) {
    const dynamicRefForm = ref(null);
    const formState = reactive({});
    const show = ref(false);
    const asyncColumns = ref([])
    const pickerKey = ref('')
    function onAction(action) {
      if (action.type === 'submit') {
        const {
          success,
          error,
          webform_id,
          api,
          type
        } = data.params;
        if (!data.params) {
          showToast({
            icon: 'error',
            title: '请完善表单！',
          });
          return;
        }
        dynamicRefForm.value.validate().then(({ valid, errors }) => {
          if (valid) {
            if (webform_id) {

              submitWebform(webform_id, formState).then(
                res => {
                  console.log(res);
                  showSuccess(success, res)
                },
                () => {
                  showToast({
                    icon: 'error',
                    title: error || res.message || '提交失败！',
                  });
                },
              );
            }
            if (api && type) {
              addNode({
                api,
                type,
                attr: {
                  ...formState
                }
              }).then(res => {
                showSuccess(success, res)
              }, () => {
                showToast({
                  icon: 'error',
                  title: error || res.message || '提交失败！',
                });
              })
            }
          } else {
            console.log('验证未通过！');
          }
        });
      }

      if (action.type === 'emit') {
        dynamicRefForm.value.validate().then(({ valid, errors }) => {
          if (valid) {
            emit('modalChange', formState)
          } else {
            console.log('验证未通过！');
          }
        })
      }

      if (action.type === 'reset') {
        dynamicRefForm.value.reset();
        resetForm();
      }
    }

    function showSuccess(success, res) {
      resetForm();
      showModal({
        title: success || '成功提交！',
        content: '返回？',
        success: res => {
          if (res.confirm) {
            navigateBack({
              delta: 1,
            });
          } else if (res.cancel) {
            console.log('取消');
          }
        },
      });
    }

    function resetForm() {
      data.form.forEach(item => {
        if (item.type === 'uploader') {
          formState[item.key] = [];
        } else {
          formState[item.key] = '';
        }
      });
    }

    function onUploadChange({ fids, key }) {
      formState[key] = fids;
    }

    const onPickerChange = ({ isShow, data, key }) => {
      show.value = isShow;
      asyncColumns.value = data;
      pickerKey.value = key;
    }

    const popupConfirm = ({ selectedValue }) => {
      formState[pickerKey.value] = selectedValue[0]
      show.value = false;
    };

    return {
      formState,
      dynamicRefForm,
      onAction,
      show,
      asyncColumns,
      onUploadChange,
      onPickerChange,
      popupConfirm
    };
  },
};
</script>

<style lang="scss">
.dynamic-form {
  .nut-cell-group .nut-cell {
    &:after {
      border-bottom-color: rgb(158 158 158 / 50%);
    }
  }
}
</style>
