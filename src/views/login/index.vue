<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登陆 / 注册"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!--
      基于 Vant 的表单验证：
      1、使用 van-form 组件包裹所有的表单项 van-field
      2、给 van-form 绑定 submit 事件
         当表单提交的时候会触发 submit 事件
         提示：只有表单验证通过，它才会调用 submit
      3、使用 Field 的rules属性定义校验规则
     -->
    <van-form
      :validate-first = "true"
      @submit="onLogin"
      :show-error="false"
      :show-error-message="false"
      @failed="onFailed"
      ref="login-form"
    >
      <van-field
        center
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        center
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            @finish="isCountDownShow = false"
            format="ss s" />
          <van-button
            v-else
            class="send-btn"
            size="small"
            :loading="isSendSmsLoading"
            round
            @click.prevent="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          type="info"
          block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import { login, sendSms } from '@/api/user'
  import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  props: {},
  components: {
  },
  data () {
    return {
      isSendSmsLoading: false,
      isCountDownShow :false,
      user : {
        mobile : '13922222222', //手机号
        code : '246810'
      },
      formRules: {
        mobile: [
          {required: true, message: '请填写手机号'},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误'}
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      }
    }
  },
  computed: {
  },
  created() {},
  mounted() {},
  watch: {
  },
  methods: {
    async onLogin() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        message: "登陆中...",
        forbidClick: true // 是否禁止背景点击
      });
      try {
        const {data} = await login(this.user)
        Toast.success('登陆成功')
        // 将后端返回的用户登录状态 放到Vuex容器中
        this.$store.commit('setUser', data.data)
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed(error) {
      if (error.errors[0]){
        this.$toast({
          message: error.errors[0].message,
          position: "top"
        })
      }
    },
    async onSendSms() {
      try {
        // 校验 手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
        this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
        this.isCountDownShow = true
        await sendSms(this.user.mobile)

        // 请求发送验证码 -> 隐藏发送按钮，显示倒计时

        // 倒计时结束 -> 隐藏倒计时，显示发送按钮
      }catch (err) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429){
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile'){
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
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
  .login-container{
    .send-btn{
      width: 80px;
      height: 23px;
      background-color: #ededed;
      .van-button__text {
        font-size: 11px;
        color: #666666;
      }
    }
    .login-btn-wrap{
      padding: 26px 16px;
      .login-btn {
        background-color: #6db4fb;
        border: none;
        .van-button__text {
          font-size: 15px;
        }
      }
    }
  }
</style>
