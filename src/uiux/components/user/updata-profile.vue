<template>
  <div class="update-profile flex flex-col h-full">
    <div class="m-md flex flex-col justify-center items-center text-center">
      <button class="avatar-wrapper rounded-full w-auto h-auto p-0 my-md" open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar">
        <image mode="aspectFill" class="rounded-full avatar block" style="width: 100px;height: 100px;"
          :src="profile.avatar ? imageUrlFix(profile.avatar) : avatar" />
        <IconFont size="16px" name="photograph"></IconFont>
      </button>
      <div class="my-md">
        <input class="nickname" type="nickname" v-model="username" placeholder="请输入昵称" @input="onChange" />
      </div>
      <div class="mt-md">
        <nut-button :disabled="disabled" @click="updateName(username)" type="primary">
          更新昵称
        </nut-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue';
import { useNavigationStore } from '@store/navigation';
import avatar from '@images/user/avatar.png';
import { showToast, navigateBack, showModal } from '@tarojs/taro';
import { imageUrlFix } from '@utils/image';
import { useUserStore } from '@store/user';
import { updateUserPicture, updateUserProfile } from '@service/index';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  name: 'update-profile',
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
  setup() {
    const userStore = useUserStore();
    const profile = computed(() => userStore.profile || null);
    const navigationStore = useNavigationStore();

    const avatarUrl = ref(null);
    const disabled = ref(true);
    const username = ref(profile.value.name);

    const onChooseAvatar = e => {
      avatarUrl.value = e.detail.avatarUrl;
      const uuid = profile.value.uuid;
      updateUserPicture(uuid, avatarUrl.value).then(res => {
        const avatar = res.data.data.attributes.uri.url;
        useUserStore().setProfile({
          ...profile.value,
          avatar,
        });
        showToast({
          icon: 'success',
          title: '头像更新成功',
        });
      });
    };

    const onChange = event => {
      if (event.detail.value === profile.value.name) {
        disabled.value = true;
      } else {
        disabled.value = false;
      }
    };

    const updateName = name => {
      showModal({
        title: '是否更新昵称？',
        success: res => {
          if (res.confirm) {
            updateUserProfile(profile.value.uid, {
              full_name: [{ value: name }],
            }).then(res => {
              console.log(res);
              showToast({
                icon: 'success',
                title: '资料更新成功',
              });
              useUserStore().setProfile({
                ...profile.value,
                name,
              });
              setTimeout(() => {
                navigateBack();
              }, 1000);
            });
          }
        },
      });
    };

    return {
      avatarUrl,
      username,
      avatar,
      onChooseAvatar,
      navigationStore,
      imageUrlFix,
      profile,
      updateName,
      onChange,
      disabled,
    };
  },
};
</script>
<style lang="scss">
.update-profile {
  .nickname {
    border-bottom: 0.5px solid var(--border-color);
  }
}

.avatar-wrapper {
  position: relative;

  .nut-icon {
    position: absolute;
    z-index: 1000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    background-color: var(--primary-color);
    border-radius: 50%;
    padding: 6px;
    opacity: 0.85;
  }
}
</style>
