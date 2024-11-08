<template>
  <div class="login flex flex-col" style="height:75vh">
    <div class="content flex-auto h-full flex justify-center items-center">
      <slot name="content">
        <ui-img :data="coreConfig.logo"></ui-img>
      </slot>
    </div>
    <div class="actions flex-none mx-xl">
      <div class="item mb-sm">
        <nut-button @click="login" size="large" type="primary">
          微信快捷登录
        </nut-button>
      </div>
      <div class="item mb-sm" @click="phoneLogin">
        <nut-button class="mb-sm" size="large" type="default">
          手机号快捷登录
        </nut-button>
      </div>
      <div class="item my-8 flex" v-if="data.policy.enable">
        <nut-popover v-model:visible="showPopover" location="top-start" theme="dark"
          :list="[{ name: data.policy.tooltip }]">
          <template #reference>
            <nut-checkbox v-model="policy" label="复选框">
              {{ data.policy.checkboxLabel }}
            </nut-checkbox>
          </template>
        </nut-popover>
        <div class="policy" @click="showPopup = true">
          {{ data.policy.label }}
        </div>
        <nut-popup position="bottom" closeable round :style="{ height: '85vh' }" v-model:visible="showPopup">
          <div class="p-md text-sm">
            <base-text :data="{
              title: {
                label: data.policy.label,
              },
              body: data.policy.content,
            }"></base-text>
          </div>
        </nut-popup>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, inject, ref, watch } from 'vue';
import { imageUrlFix } from '@utils/image';
import { showModal, switchTab } from '@tarojs/taro';
import { gotoPage } from '@utils/index';
import BaseText from '@uiux/widgets/base-text.vue';
import { auth } from '@service';
import useUserStore from '@store/user';
import UiImg from '@uiux/widgets/ui-img.vue';
import { getStorageSync } from '@tarojs/taro';
export default {
  name: 'login',
  components: {
    'ui-img': UiImg,
    BaseText,
  },
  props: {
    data: {
      type: Object,
    },
  },
  setup({ data }) {
    const policy = ref(false);
    const showPopup = ref(false);
    const showPopover = ref(false);
    const coreConfig = inject('coreConfig');
    const userStore = useUserStore();
    const profile = computed(() => userStore.profile);

    watch(profile, value => {
      if (value) {
        const returnUrl = getStorageSync('returnUrl');
        if (returnUrl) {
          gotoPage(returnUrl);
        } else {
          console.log('goto tab');
          // 跳转到 tab 页
          switchTab({
            url: 'user',
          });
        }
      }
    });

    watch(policy, value => {
      if (value) {
        showPopover.value = true;
      }
    })

    const login = () => {
      if (!policy.value) {
        showPopover.value = true;
        return;
      }

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

    const phoneLogin = () => {
      if (!policy.value) {
        showPopover.value = true;
        return;
      }

      gotoPage('/mini/phone-login');
    };

    return {
      coreConfig,
      imageUrlFix,
      policy,
      login,
      phoneLogin,
      showPopover,
      showPopup,
    };
  },
};
</script>
<style lang="scss">
.policy {
  color: var(--primary-color);
}

.login {
  .content {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: -40px;
      left: 50%;
      width: 130vw;
      height: 90%;
      transform: translateX(-50%);
      border-bottom-left-radius: 50%;
      border-bottom-right-radius: 50%;
      background-color: var(--primary-color);
      z-index: -1;
    }
  }
}

.actions {
  .popover-menu-name {
    white-space: nowrap;
  }
}
</style>
