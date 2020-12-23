<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <!--
  标签页组件有一个功能，只有你第1次查看标签页的时候才会渲染里面的内容
 -->
    <van-tabs v-model="active">
      <van-tab
        :key = "channel.id"
        v-for="channel in channels"
        :title="channel.name">
        <article-list :channel="channel"></article-list>
      </van-tab>
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>
  import ArticleList from './components/article-list'
  import { getUserChannels } from '@/api/user'
export default {
  name: 'HomeIndex',
  props: {},
  components: {
    ArticleList
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels : [] //频道列表
    }
  },
  computed: {
  },
  created() {
    this.loadChannels()
  },
  mounted() {},
  watch: {
  },
  methods: {
    async loadChannels() {
      // 获取频道数据
      const {data} = await getUserChannels()
      this.channels = data.data.channels
    }
  },
  filters: {
    fnName: function (value) {
      return value
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    /deep/ .van-nav-bar__title {
      max-width: none;
    }
    .search-btn{
      width: 277px;
      height: 32px;
      background: #5babfb;
      border: none;
      .van-icon {
        font-size: 16px;
      }
      .van-button__text {
        font-size: 14px;
      }
    }
    .channel-tabs {
      /deep/ .van-tab {
        border-right: 1px solid #edeff3;
        border-bottom: 1px solid #edeff3;
      }
      /deep/ .van-tabs__line {
        bottom: 20px;
        width: 15px !important;
        height: 3px;
        background: #3296fa;
      }
    }
  }
</style>
