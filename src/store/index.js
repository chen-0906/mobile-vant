import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
// 这样做的目的可以避免访问和获取数据的名字不一致导致的问题
const USER_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //user : JSON.parse(window.localStorage.getItem('TOUTIAO_USER')) // 当前用户登录的状态
    user : getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      //window.localStorage.setItem('TOUTIAO_USER', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
