<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {
  },
  created() {},
  mounted() {},
  watch: {
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true // 禁止背景点击
      })
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 请求提交更新用户性别
      await updateUserProfile({
        birthday: date
      })

      this.$emit('input', date)
      this.$emit('close')

      this.$toast.success('保存成功')
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
