<template>
  <component :is="getComponent(data.content)" :pageConfig="data.pageConfig" :data="data.content" :config="data.config"
    :urlParams="data.urlParams" />
</template>

<script>
/**
 * @Components
 */
import UiImg from '@widgets/ui-img.vue';
import My from '@components/user/my.vue';
import Article from '@uiux/nodes/article.vue';
import Meta from '@components/other/meta.vue';
import Login from '@components/user/login.vue';
import BaseText from '@widgets/base-text.vue';
import Search from '@components/action/search.vue';
import NoticeBar from '@components/other/notice-bar.vue';
import PhoneLogin from '@components/user/phone-login.vue';
import DynamicForm from '@components/form/dynamic-form.vue';
import UpdateProfile from '@components/user/updata-profile.vue';
import MediaList1v1 from '@components/list/media-list-1v1.vue';
import MediaList1v2 from '@components/list/media-list-1v2.vue';
import Carousel1v5 from '@components/carousel/carousel-1v5.vue';
import DynamicScroller from '@components/list/dynamic-scroller.vue';
import DynamicCardList1v2 from '@components/list/dynamic-card-list-1v2.vue';
export default {
  name: 'dynamic-component',
  components: {
    My,
    Meta,
    UiImg,
    Login,
    Search,
    Article,
    BaseText,
    NoticeBar,
    PhoneLogin,
    Carousel1v5,
    DynamicForm,
    MediaList1v1,
    MediaList1v2,
    UpdateProfile,
    DynamicScroller,
    DynamicCardList1v2,
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
    const getComponent = content => {
      return content.name === 'text' ? 'base-text' : content.name;
    };

    return {
      getComponent
    }
  },
};
</script>
<style lang="scss"></style>
