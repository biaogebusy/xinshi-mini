<template>
  <div class="page-binding">
    <dynamic-page :options="options">
      <template #components>
        <div>
          <div class="text-xl text-center my-md">绑定已有账号</div>
        </div>
        <nut-form :model-value="formData" ref="ruleForm">
          <nut-form-item prop="user" required :rules="[{ required: true, message: '请填写用户名' }]">
            <input class="nut-input-text" placeholder="请输入用户名" v-model="formData.user" type="text" />
          </nut-form-item>

          <nut-form-item prop="pass" required :rules="[{ required: true, message: '请填写密码' }]">
            <input type="password" v-model="formData.pass" class="nut-input-text" placeholder="请输入密码" />
          </nut-form-item>
        </nut-form>
        <div class="flex items-center justify-center">
          <div class="px-sm w-full w-6/12">
            <nut-button :block="true" type="primary" @click="submit">
              提交
            </nut-button>
          </div>
        </div>
      </template>
    </dynamic-page>
  </div>
</template>
<script>
import { ref, reactive } from 'vue';
import { showToast, navigateBack } from '@tarojs/taro';
import { wechatUserBindDrupalUser, getDrupalProfile } from '@service/index';
import DynamicPage from '@uiux/dynamic-page.vue';

export default {
  name: 'page-binding',
  components: {
    DynamicPage,
  },
  setup(props) {
    const options = ref({
      url: '/user/register',
      backButton: true,
      tabBar: false,
    });

    const formData = reactive({
      user: '',
      pass: '',
    });

    const captchaDisabled = ref(false);
    const ruleForm = ref(null);

    const submit = () => {
      ruleForm.value.validate().then(({ valid, errors }) => {
        if (valid) {
          // console.log('success', formData);
          appBindAdmin(formData);
        }
      });
    };

    function appBindAdmin(data) {
      console.log(data);
      wx.showLoading();

      appLogin()
        .then(({ code }) => {
          return wechatUserBindDrupalUser({ code, ...data });
        })
        .then(({ data, header }) => {
          console.log(data);
          console.log(header);

          if (data.errMsg) {
            wx.hideLoading();
            throw new Error(data.errMsg);
          }

          setStorageSync('sessionid', header['Set-Cookie']);
          setStorageSync('csrf_token', data.csrf_token);

          return getDrupalProfile();
        })
        .then(res => {
          wx.hideLoading();

          $store.commit('SET_PERSONAL_PROFILE', res.data);

          showToast({
            title: '绑定成功！',
            complete() {
              navigateBack({
                delta: 1,
              });
            },
          });
        })
        .catch(e => {
          console.log(e.message);
          wx.hideLoading();

          showToast({
            title: e.message || '绑定失败！',
            icon: 'none',
          });
        });
    }

    return {
      options,
      formData,
      ruleForm,
      submit,
      appBindAdmin,
    };
  },
};
</script>
<style lang=""></style>
