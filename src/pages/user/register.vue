<template>
  <div class="page-register">
    <dynamic-page :options="options">
      <template #components>
        <div>
          <div class="text-xl text-center my-md">注册后台账号</div>
        </div>
        <nut-form :model-value="formData" ref="ruleForm">
          <nut-form-item prop="mobile_number" required :rules="[{ required: true, message: '请填写手机号' }]">
            <input class="nut-input-text" placeholder="请输入手机号" v-model="formData.mobile_number" type="text" />
          </nut-form-item>

          <nut-form-item prop="verification_code" required :rules="[{ required: true, message: '请填写验证码' }]">
            <div class="flex">
              <input type="text" v-model="formData.verification_code" name="verification_code"
                class="nut-input-text flex-auto" placeholder="请输入验证码" />
              <div class="px-sm text-primary flex-none" :class="{ 'opacity-70': captchaDisabled }" @click="getCaptcha">
                {{ captchaText }}
              </div>
            </div>
          </nut-form-item>
        </nut-form>
        <div class="flex items-center justify-center">
          <div class="px-sm w-full w-6/12">
            <nut-button :block="true" type="primary" @click="submit">
              提交
            </nut-button>
          </div>
          <div class="px-sm opacity-70" @click="navigateTo({ url: '/pages/user/binding' })">
            已有账号，去绑定
          </div>
        </div>
      </template>
    </dynamic-page>
  </div>
</template>
<script>
import { ref, reactive } from 'vue';
import { useUserStore } from '@store/user';
import { showToast, navigateTo, navigateBack } from '@tarojs/taro';
import { Form, FormItem, Button } from '@nutui/nutui-taro';
import {
  wechatBindDrupalPhoneUser,
  appLogin,
  getPhoneCaptcha,
  getDrupalProfile,
} from '@service/index';
import DynamicPage from '@uiux/dynamic-page.vue';

export default {
  name: 'page-register',
  components: {
    DynamicPage,
    'nut-form': Form,
    'nut-form-item': FormItem,
    'nut-button': Button,
  },
  setup(props) {
    const userStore = useUserStore();
    const options = ref({
      url: '/user/register',
      backButton: true,
      tabBar: false,
    });

    const formData = reactive({
      mobile_number: '',
      verification_code: '',
    });

    const captchaDisabled = ref(false);
    const ruleForm = ref(null);
    const captchaText = ref('获取验证码');

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
          return wechatBindDrupalPhoneUser({ code, ...data });
        })
        .then(({ data, header }) => {
          console.log(data);
          console.log(header);

          if (data.errMsg) {
            wx.hideLoading();
            throw new Error(data.errMsg);
          }

          userStore.setToken(data.csrf_token);
          userStore.setCookie(header['Set-Cookie']);

          return getDrupalProfile();
        })
        .then(res => {
          wx.hideLoading();

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

    function getCaptcha() {
      console.log('getCaptcha');
      if (captchaDisabled.value) return;

      if (
        formData.mobile_number &&
        /^[1][3,4,5,7,8][0-9]{9}$/.test(formData.mobile_number)
      ) {
        getPhoneCaptcha({ mobile_number: formData.mobile_number })
          .then(res => {
            if (res.data.status) {
              showToast({
                title: '验证码已发送！',
                icon: 'none',
              });

              captchaDelay();
            } else {
              showToast({
                title: res.data.message,
                icon: 'none',
              });
            }
          })
          .catch(() => {
            showToast({
              title: '验证码发送失败！',
              icon: 'none',
            });
          });
      } else {
        showToast({
          title: '手机号格式错误！',
          icon: 'none',
        });
      }
    }

    function captchaDelay() {
      let countdown = 60;
      captchaDisabled.value = true;
      captchaText.value = countdown + 's后可再次发送';

      let timer = setInterval(() => {
        countdown--;
        captchaText.value = countdown + 's后可再次发送';

        if (countdown <= 0) {
          captchaText.value = '获取验证码';
          captchaDisabled.value = false;
          clearInterval(timer);
        }
      }, 1000);
    }

    return {
      options,
      navigateTo,
      formData,
      ruleForm,
      submit,
      appBindAdmin,
      getCaptcha,
      captchaDelay,
      captchaText,
    };
  },
};
</script>
<style lang=""></style>
