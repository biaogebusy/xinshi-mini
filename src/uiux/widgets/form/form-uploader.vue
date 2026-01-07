<template>
  <nut-uploader :maximum="getOptionValue('max') || 1" ref="uploadRef" @change="onChange" @delete="onDelete"
    :auto-upload="false"></nut-uploader>
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
  setup({ data }, { emit }) {
    const uploadRef = ref(null);
    const filesState = reactive({
      fids: [],
      uuids: []
    });

    const onChange = ({ fileList }) => {
      uploadOneByOne(fileList, 0, 0, 0, fileList.length);
    };

    const uploadOneByOne = (fileList, successUp, failUp, i, length) => {
      uploadFile(fileList[i].path, data.api)
        .then(file => {
          successUp = successUp + 1;
          fileList[i].message = '上传成功';
          filesState.fids.push(file.data.data.attributes.drupal_internal__fid);
          filesState.uuids.push(file.data.data.id)
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
              key: data.key,
              uuids: filesState.uuids
            });
          } else {
            uploadOneByOne(fileList, successUp, failUp, i, length);
          }
        });
    };

    const onDelete = files => {
      filesState.fids.splice(files.index, 1);
      filesState.uuids.splice(files.index, 1);
      emit('uploadChange', { fids: filesState.fids, key: data.key, uuids: filesState.uuids });
    };

    function getOptionValue(key) {
      if (data.options) {
        return data.options[key];
      } else {
        return false;
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
