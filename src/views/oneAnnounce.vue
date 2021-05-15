<template>
  <el-card shadow="hover" class="box-card">
    <div class="annTitle">
      {{title}}
    </div>
    <br>
    <div class="annTitleDown">
      {{name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{time}}
    </div>
    <div class="annText">
      <div class="ql-editor" v-html="text"></div>
    </div>
  </el-card>
</template>

<script>
// import {quillEditor} from 'vue-quill-editor'
export default {
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {
      announceId: '',
      title: '',
      text: '',
      name: '',
      time: ''
    }
  },
  // 通过路由获取id
  activated () {
    if (this.$route.query.announceId !== undefined) {
      this.announceId = this.$route.query.announceId
    }
  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    announceId: function (val) {
      this.getAnnounce(val)
      // this.getDetailsPicture(val)
    }
  },
  // 方法集合",
  methods: {
    getAnnounce (announceId) {
      console.log(announceId)
      this.$http.get(`announcement/getOneAnnounce?id=${this.announceId}`).then(res => {
        if (res.data.code === '0000') {
          const data = res.data.data
          console.log(res.data)
          this.title = data.title
          this.text = this.decode(data.text)
          this.name = data.borSName
          this.time = data.touptime
        }
      })
    },
    decode (base64) {
      // 对base64转编码
      const decode = atob(base64)
      // 编码转字符串
      return decodeURI(decode)
    }
  }
}
</script>

<style>
.box-card {
  width: 1250px;
  min-width: 1250px;
  margin-left: 237px;
  margin-top: 30px;

}
.annTitle{
  font-family: STXingkai;
  font-size: 55px;
  text-align: center;
}
.annTitleDown{
  font-style: oblique;
  color: #8c939d;
  font-size: 17px;
  text-align: center;
  margin-left: 250px;
}
.annText{
  margin-top: 50px;
  text-align: left;
  width: 1100px;
}
</style>
