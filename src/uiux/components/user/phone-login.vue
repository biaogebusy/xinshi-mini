<template>
  <div class="phone-login">
    <div class="text-3xl my-2xl">
      <rich-text :nodes="data.title"></rich-text>
    </div>
    <nut-form :model-value="formData" ref="ruleForm">
      <nut-form-item prop="mobile_number" required :rules="[{ required: true, message: '请填写手机号' }]">
        <input class="nut-input-text" placeholder="请输入手机号" v-model="formData.mobile_number" type="tel" />
      </nut-form-item>
      <nut-form-item prop="verification_code" required :rules="[{ required: true, message: '请填写验证码' }]">
        <div class="flex">
          <input type="number" v-model="formData.verification_code" name="verification_code"
            class="nut-input-text flex-auto" placeholder="请输入验证码" />
          <div class="px-sm text-primary flex-none" :class="{ 'opacity-70': captchaDisabled }" @click="getCaptcha">
            {{ captchaText }}
          </div>
        </div>
      </nut-form-item>
    </nut-form>
    <div class="flex items-center justify-center my-2xl">
      <div class="px-sm w-full w-6/12">
        <nut-button :disabled="disabled" :block="true" type="primary" @click="login">
          登录/注册
        </nut-button>
      </div>
    </div>
    <div class="actions flex items-center justify-center w-full">
      <div class="item flex flex-col items-center" @click="wxlogin">
        <IconFont font-class-name="iconfont" class-prefix="icon" size="20px" name="weixin" />
        <div class="mt-sm">微信登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch, computed } from 'vue';
import { useUserStore } from '@store/user';
import {
  showToast,
  switchTab,
  showLoading,
  hideLoading,
  showModal,
} from '@tarojs/taro';
import {
  getPhoneCaptcha,
  loginOrRegisterByPhone,
  auth,
  getDrupalProfile,
} from '@service/index';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'phone-login',
  components: {
    IconFont
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const profile = computed(() => userStore.profile || null);
    const disabled = ref(true);

    const formData = reactive({
      mobile_number: '',
      verification_code: '',
    });

    watch(formData, value => {
      if (value.mobile_number && value.verification_code) {
        disabled.value = false;
      } else {
        disabled.value = true;
      }
    });

    const captchaDisabled = ref(false);
    const ruleForm = ref(null);
    const captchaText = ref('获取验证码');

    const login = () => {
      ruleForm.value.validate().then(({ valid, errors }) => {
        if (valid) {
          console.log('success', formData);
          showLoading();
          loginOrRegisterByPhone({
            mobile: formData.mobile_number,
            code: formData.verification_code,
          }).then(({ data, header }) => {
            hideLoading();
            if (!data.status) {
              showToast({
                title: data.message,
                icon: 'error',
              });
              return;
            }
            userStore.setSessionid(header['Set-Cookie']);
            userStore.setToken(data.csrf_token);
            getDrupalProfile().then(({ data }) => {
              userStore.setProfile(data);
              loginSucess();
            });
          });
        }
      });
    };

    const loginSucess = () => {
      showToast({
        title: '登录成功！',
        complete() {
          switchTab({
            url: 'user',
          });
        },
      });
    };

    function getCaptcha() {
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

    watch(profile, value => {
      if (value) {
        loginSucess();
      }
    });

    const wxlogin = () => {
      showModal({
        title: '提示',
        content: '请允许获取您的微信个人信息',
        cancelText: '取消',
        confirmText: '确定',
        success({ confirm }) {
          if (confirm) {
            auth();
          }
        },
      });
    };

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
      formData,
      ruleForm,
      login,
      getCaptcha,
      captchaDelay,
      captchaText,
      captchaDisabled,
      disabled,
      wxlogin,
    };
  },
};
</script>
<style lang="scss">
.phone-login {
  .nut-cell {
    padding-left: 0;
    padding-right: 0;

    &:after {
      right: 0;
      left: 0;
      transform: none;
      border-bottom-color: rgba(204, 204, 204, 0.5) !important;
    }

    &:last-child {
      &:after {
        border-bottom: 1px solid rgba(204, 204, 204, 0.5) !important;
      }
    }
  }

  .actions {
    position: absolute;
    bottom: 10%;
    left: 0;

    .item {
      .nut-icon {
        background-color: var(--primary-color);
        border-radius: 50%;
        padding: 10px;
        color: #fff;
      }
    }
  }
}
</style>
