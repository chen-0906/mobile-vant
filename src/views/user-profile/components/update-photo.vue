<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image">
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
  import 'cropperjs/dist/cropper.css'
  import Cropper from 'cropperjs'
  import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      // type: Object,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      image : window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  computed: {
  },
  created() {},
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image

    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  watch: {
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true,
        duration: 0 // 展示时间，0 表示持续展示
      })
      const fd = new FormData()
      const file = await this.getCroppedCanvas()
      fd.append('photo', file)
      await updateUserPhoto(fd)

      this.$emit('update-photo', window.URL.createObjectURL(
        file
      ))
      // 关闭弹出层
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
  .update-photo {
    height: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
  }
  /* Ensure the size of the image fit the container perfectly */
  .image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
</style>
