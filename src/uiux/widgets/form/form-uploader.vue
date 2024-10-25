<template>
  <nut-uploader :multiple="getOptionValue('multiple') || false" :maximum="getOptionValue('max') || 5" ref="uploadRef"
    @change="onChange" @delete="onDelete" :auto-upload="false"></nut-uploader>
</template>
<script>
import { ref, reactive, toRefs } from 'vue';
import { uploadFile } from '@service';

export default {
  name: 'form-uploader',
  props: {
    data: {
      type: Object,
    },
    modelValue: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
  },
  emits: ['uploadChange'],
  setup(props, { emit }) {
    const uploadRef = ref(null);
    const filesState = reactive({
      fids: [],
    });

    const onChange = ({ fileList }) => {
      uploadOneByOne(fileList, 0, 0, 0, fileList.length);
    };

    const uploadOneByOne = (fileList, successUp, failUp, i, length) => {
      uploadFile(fileList[i].path)
        .then(file => {
          successUp = successUp + 1;
          fileList[i].message = '上传成功';
          filesState.fids.push(file.data.data.attributes.drupal_internal__fid);
        })
        .catch(() => {
          failUp = failUp + 1;
        })
        .finally(() => {
          i = i + 1;
          if (i === length) {
            console.log(`总共：${successUp} 张成功，${failUp} 张失败！`);
            emit('uploadChange', {
              fids: filesState.fids,
              key: props.data.key,
            });
          } else {
            uploadOneByOne(fileList, successUp, failUp, i, length);
          }
        });
    };

    const onDelete = files => {
      filesState.fids.splice(files.index, 1);
      emit('uploadChange', { fids: filesState.fids, key: props.data.key });
    };

    function getOptionValue(key) {
      if (props.data.options) {
        return props.data.options[key];
      } else {
        return null;
      }
    }

    return {
      getOptionValue,
      uploadRef,
      onChange,
      onDelete,
      ...toRefs(filesState),
    };
  },
};
</script>
<style lang=""></style>
