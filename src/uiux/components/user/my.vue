<template>
  <div class="my h-full box-border overflow-auto">
    <image class="user-bg" mode="aspectFill" style="width: 100%;height: 200px;" :src="imageUrlFix(data.bg)" />
    <div class="flex flex-col h-full relative">
      <div class="user-box">
        <div class="user-profile py-md">
          <div class="my-md mx-md" v-if="!profile">
            <div class="flex items-center" @click="gotoPage('/mini/login')">
              <div class="px-sm">
                <image mode="aspectFill" style="width: 60px;height: 60px;" :src="avatar" />
              </div>
              <div class="px-sm flex flex-col">
                <div class="text-base">
                  登录信使小程序
                </div>
              </div>
            </div>
          </div>

          <div class="my-md mx-md flex items-center" v-if="profile">
            <div class="px-sm" @click="gotoPage(data.updateUrl)">
              <image class="rounded-full" mode="aspectFill" style="width: 60px;height: 60px;"
                :src="profile.avatar ? imageUrlFix(profile.avatar) : avatar" />
            </div>
            <div class="px-sm flex flex-col -my-sm">
              <div class="name mr-xs font-bold" @click="gotoPage(data.updateUrl)">
                {{ profile.full_name || profile.name }}
                <IconFont size="12" name="edit"></IconFont>
              </div>
              <div class="flex">
                <template v-for="value in profile.roles" :key="value">
                  <div class="role mr-xs" v-if="value !== '已登录用户'">
                    {{ value }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="dynamic flex flex-col gap-5" v-if="profile && data.dynamic">
          <template v-for="(item, key) in data.dynamic" :key="key">
            <component v-if="checkRoleShow(item)" :data="item" :is="item.type">
            </component>
          </template>
        </div>
      </div>

      <div class="user-info flex-auto" v-if="profile">
        <nut-cell-group>
          <template v-for="(item, key) in data.menu" :key="key">
            <nut-cell v-if="checkRoleShow(item)" :icon="item.icon" :title="item.title" :is-link="true"
              @click="gotoPage(item.url)" />
          </template>
          <nut-cell v-if="!token" icon="my" title="注册 / 绑定账号" :is-link="true"
            @click="gotoPage('tab=/pages/user/register')" />
          <nut-cell v-if="token" icon="del" title="退出登录" :is-link="true" @click="logout" />
        </nut-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { showModal } from '@tarojs/taro';
import { gotoPage } from '@utils/index';
import { useUserStore } from '@store/user';
import { auth, checkRoleShow, gotoLogin } from '@service/index';
import { imageUrlFix } from '@utils/image';
import avatar from '@images/user/avatar.png';
import { IconFont } from '@nutui/icons-vue-taro';
import mediaList1v2 from '../list/media-list-1v2.vue';
export default {
  name: 'my',
  components: {
    IconFont,
    mediaList1v2
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    const userStore = useUserStore();
    const profile = computed(() => userStore.profile || null);
    const token = computed(() => userStore.token || null);
    const code = computed(() => userStore.code);
    if (!profile.value && !token.value) {
      gotoLogin();
    }

    const login = () => {
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

    const logout = () => {
      showModal({
        content: '是否退出登录？',
        cancelText: '取消',
        confirmText: '退出',
        success({ confirm }) {
          if (confirm) {
            userStore.clearUserInfo();
          }
        },
      });
    };

    const copyCode = code => {
      wx.setClipboardData({
        data: code,
      });
    };

    return {
      logout,
      imageUrlFix,
      avatar,
      gotoPage,
      profile,
      userStore,
      token,
      login,
      checkRoleShow,
      code,
      copyCode,
    };
  },
};
</script>
<style lang="scss">
.my {
  .user-box {
    position: relative;
    z-index: 2;
  }

  .user-bg {
    position: absolute;
    width: 100px;
    height: 122px;
    right: 0;
    top: 12%;
  }

  .name {
    font-size: var(--font-size-lg);
    color: #333;
  }

  .navigator-hover {
    color: blue;
  }

  .nut-cell {
    display: flex;
    align-items: center;
  }

  .nut-cell__icon {
    margin-right: var(--spacing-sm);

    .nut-icon {
      width: var(--font-size-md) !important;
      height: var(--font-size-md) !important;
      font-size: var(--font-size-md) !important;
      color: var(--primary-color);
    }
  }

  .nut-cell__link {
    width: var(--font-size-md) !important;
    height: var(--font-size-md) !important;
    font-size: var(--font-size-md) !important;
  }

  .code {
    background: linear-gradient(326deg,
        rgb(var(--primary-color-rgb) / 0.3) 0%,
        rgb(var(--primary-color-rgb) / 0.7) 100%);
  }

  .user-footer {
    .action {
      button {
        background: #f0fbf7;
        border-width: 0;
        color: var(--primary-color);
      }
    }
  }
}
</style>
