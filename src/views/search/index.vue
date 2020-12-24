<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @focus="isResultShow=false"
        background="#3296fa"
        @search="onSearch(searchText)"
        @cancel="onCancel"
      />
    </form>


    <!-- 搜索结果 -->
    <search-result
      :search-text="searchText"
      v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      @search="onSearch($event)"
      :search-text="searchText"
      v-else-if="searchText" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      @search="onSearch($event)"
      @update-histories="searchHistories=$event"
      :search-histories="searchHistories"/>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
  import SearchSuggestion from './components/search-suggestion'
  import SearchHistory from './components/search-history'
  import SearchResult from './components/search-result'
  import { setItem, getItem } from '@/utils/storage'
  import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  props: {},
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadSearchHistories()
  },
  mounted() {},
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch (searchText) {
      this.searchText = searchText
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(searchText)

      // 如果用户已登录，则把搜索历史记录存储到线上
      //    提示：只要我们调用获取搜索结果的数据接口，后端会给我们自动存储用户的搜索历史记录
      // 如果没有登录页，则把搜索历史记录存储到本地

      // setItem('search-histories', this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    async loadSearchHistories () {
      // 因为后端帮我们存储的用户搜索历史记录太少了（只有4条）
      // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
      // 如果用户已登录
      let searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getSearchHistories()
      //   // 合并数组： [...数组, ...数组]
      //   // 把 Set 转为数组：[...Set对象]
      //   // 数组去重：[...new Set([...数组, ...数组])
      //   searchHistories = [...new Set([
      //     ...searchHistories,
      //     ...data.data.keywords
      //   ])]
      // }

      this.searchHistories = searchHistories
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
  .search-container {
    .van-search__action {
      color: #fff;
    }
  }
</style>
