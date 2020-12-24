<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(str,index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
  import { getSearchSuggestions } from '@/api/search'
  // lodash 支持按需加载，有利于打包结果优化
  import { debounce } from "lodash"
export default {
  name: 'SearchSuggestion',
  props: {
    searchText :{
      type : String,
      required : true
    }
  },
  components: {
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {
  },
  created() {},
  mounted() {},
  watch: {
    // 属性名： 要监视的数据的名称
    // 监视的完整写法
    // searchText () {
    //
    // }
    searchText : {
      // 当数据发生变化时会执行handler处理函数
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler : debounce(async function () {
        const searchContent = this.searchText
        if (!searchContent) {
          return
        }

        // 1. 请求获取数据
        const { data } = await getSearchSuggestions(searchContent)

        // 2. 将数据添加到组件实例中
        this.suggestions = data.data.options

        // 3. 模板绑定
      }, 200),
      // async handler () {
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },
      //初始化的时候也要执行 该回调会在监听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    // 参数 source: 原始字符串
    // 参数 keyword: 需要高亮的关键词
    // 返回值：替换之后的高亮字符串
    highlight (source, keyword){
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${keyword}</span>`)
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

</style>
