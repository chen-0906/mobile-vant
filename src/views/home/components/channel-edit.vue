<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :icon="isEdit && index !== 0? 'clear': ''"
        :class="{ active: index === active }"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text= "channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
  import {getAllChannels, addUserChannel, deleteUserChannel} from '@/api/channel'
  import { mapState } from 'vuex'
  import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    userChannels:{
      type: Array,
      required:true
    },
    active: {
      type: Number,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      allChannels: [], //所有频道数据列表
      isEdit: false, //控制编辑显示状态
    }
  },
  computed: {
    ...mapState(['user']),
    //推荐的频道列表
    recommendChannels() {
      // 所有频道减去我的频道
      // filter方法 过滤数据 根据方法返回的布尔值  根据返回的true来收集数据
      return this.allChannels.filter(channel => {
        // 判断channel是否是否属于用户频道
        // find方法 是查找满足该条件的元素
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  watch: {
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd(channel) {
      this.userChannels.push(channel)

      // TODO: 数据持久化
      if (this.user) {
        // 已登录，数据存储到线上
        await addUserChannel([{
          id: channel.id, // 频道 id
          seq: this.userChannels.length // 频道的 序号
        }])
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel(channel, index) {
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        // 登录了，持久化到线上
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel(index) {
      // 切换频道
      this.$emit('update-active', index)
      this.$emit('close')
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
  .channel-edit {
    padding-top: 54px;

    .channel-title {
      font-size: 16px;
      color: #333333;
    }

    .grid-item{
      width: 80px;
      height: 43px;
      /deep/ .van-grid-item__content {
        background-color: #f4f5f6;
        .van-grid-item__text {
          font-size: 14px;
          color: #222;
          margin-top: 0;
        }
      }
      /deep/ .van-grid-item__icon {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 20px;
        color: #ccc;
        z-index: 5;
      }
    }
    .active {
      /deep/ .van-grid-item__text {
        color: red !important;
      }
    }
  }
</style>
