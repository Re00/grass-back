<template>
  <el-card class="goodsBox-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>所有产品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    搜索框-->
    <el-row class="search">
      <el-col>
        <el-input placeholder="请输入内容"
                  v-model="query"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click.prevent="searchGoods()">
          </el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--    表格-->
    <el-table
      :data="tableData"
      style="width: 100%;text-align: center">
      <el-table-column
        label="#"
        width="60"
        type="index"
      >
      </el-table-column>

      <el-table-column
        label="产品图片"
        width="100"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            :title="scope.row.gname"
            trigger="hover">
            <img :src="scope.row.gimgMain"
                 style="max-height: 400px;max-width: 450px"/>
            <img slot="reference"
                 :src="scope.row.gimgMain"
                 style="max-height: 50px;max-width: 150px"
            />
          </el-popover>
        </template>

      </el-table-column>

      <el-table-column
        prop="gsalerId"
        label="所属供货商编号"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="gid"
        label="产品编号"
        width="180"
        sortable
      >
      </el-table-column>

      <el-table-column
        prop="gname"
        label="产品名称"
        width="230"
      >
      </el-table-column>

      <el-table-column
        prop="gnum"
        label="产品库存"
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="gpride"
        label="产品价格"
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="ginfo"
        label="产品简介"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="touptime"
        label="上架时间"
        width="160"
        sortable>
      </el-table-column>

      <el-table-column label="操作" >
        <template slot-scope="scope" style="text-align: center;">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.gid)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--    分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--修改表单-->
    <el-dialog
      title="产品信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :before-close="closeDialog">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="产品图片" :label-width="formLabelWidth">
          <el-upload
            :action="actionAddr"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            :limit="5"
            :file-list="imgList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="产品编号" :label-width="formLabelWidth" >
          <el-input v-model="form.gid" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="gname">
          <el-input v-model="form.gname"
                    autocomplete="off"
                    placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品库存" :label-width="formLabelWidth" prop="gnum">
          <!--          <el-input-number v-model="form.gnum" @change="handleChange" :min="1" :max="form.gnum" label="描述文字"></el-input-number>-->
          <el-input v-model="form.gnum"
                    autocomplete="off"
                    placeholder="请输入产品库存"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" :label-width="formLabelWidth" prop="gpride">
          <el-input v-model="form.gpride"
                    autocomplete="off"
                    placeholder="请输入产品价格"></el-input>
        </el-form-item>
        <el-form-item label="产品划线价" :label-width="formLabelWidth" prop="glinepride">
          <el-input v-model="form.glinepride"
                    autocomplete="off"
                    placeholder="请输入产品划线价"></el-input>
        </el-form-item>
        <el-form-item label="产品简介" :label-width="formLabelWidth">
          <el-input v-model="form.ginfo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="updateOrder()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  inject: ['reload'],
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {
      // 搜索值
      query: '',
      searchTF: false,
      // 分页值
      current: 1,
      size: 5,
      total: 0,
      // 状态类型
      type: 1,
      // 表单数据
      tableData: [],
      // 修改显示参数
      centerDialogVisible: false,
      // 修改表格宽度
      formLabelWidth: '120px',

      // 修改表格数据
      form: {
        gid: '',
        gimg: '',
        gimgMain: '',
        gname: '',
        ginfo: '',
        gnum: '',
        gpride: '',
        glinepride: ''
      },
      // 表单数据验证
      rules: {
        gname: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        gnum: [
          { required: true, message: '请输入产品库存', trigger: 'blur' },
          {type: 'number', message: '产品库存必须为数字值'}

        ],
        gpride: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        glinepride: [
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数', trigger: 'blur' }
        ]
      },
      // 修改时的产品数量
      num: 1,
      // 图片上传删除链接
      actionAddr: 'http://localhost:8081/goods/uploadMain',
      // 修改时的图片显示
      dialogImageUrl: '',
      dialogVisible: false,
      imgList: [],
      // upload token
      headers: {
        token: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  // 方法集合",
  methods: {
    // 修改表单图片方法
    beforeUpload (file) {
      //  上传之前
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)

      const whiteList = ['jpg', 'jpeg', 'png']

      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.warning('上传文件只能是 jpg、jpeg、png格式')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 1MB')
        return false
      }
    },
    handleSuccess (file) {
      this.$message.success('成功上传')
      let url = this.form.gimg
      let tmpUrl = file.msg
      if (url === '') {
        this.form.gimg = tmpUrl
        // this.imgList.push(tmpUrl) // 更新上传表单
      } else {
        this.form.gimg = url + ',' + tmpUrl
        // this.imgList = this.form.gimg.split(',') // 更新上传表单
      }
    },
    handleRemove (file) {
      // 移除图片
      console.log(file.url)
      let nowUrl = file.url// 要移出的图片在云端的路径
      let urlStr = this.form.gimg// 当前已保存路径
      let deleteUrl = '' // 要删除的url
      if (urlStr.indexOf(',') === -1) {
        // 如果只有一个图片
        deleteUrl = urlStr
        this.form.gimgMain = 'http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619861009442.jpeg'
        this.form.gimg = ''
      } else {
        // 有多个图片
        let urlArr = urlStr.split(',')// 字符串转数组
        let Index = urlArr.findIndex((item) => {
          return item === nowUrl // 寻找索引
        })
        // urlArr[Index].split('/')[3],删除key
        deleteUrl = urlArr[Index].split('/')[3] // 先赋值要删除的地址
        urlArr.splice(Index, 1)// 在删除url
        this.imgList = urlArr // 赋值当前显示表单
        this.form.gimg = urlArr.toString()// 数组转字符串并赋值，赋值表单

        if (urlArr.length === 0) {
          // 如果删除后没有图片了，主图为空
          this.form.gimgMain = 'http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619861009442.jpeg'
        } else {
          // 如果只有一条地址，或多条地址，主图为第一图
          this.form.gimgMain = urlArr[0]
        }
      }

      this.$http.post(`goods/deleteImg?key=${deleteUrl}`).then((res) => {
        this.$http.put(`goods/updateGoodByGid`, this.form).then((res) => {
          // 防止删除后不提交
          const {msg, code} = res.data
          if (code === '0000') {
            this.$message.success('已移除')
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    closeDialog () {
      this.centerDialogVisible = false
      this.imgList = [] // 清空表单
      // this.reload()
    },
    updateOrder () {
      //  提交表单修改订单信息
      this.centerDialogVisible = false
      // 提交时，修改主图问题

      let imgTemp = this.form.gimg

      if (imgTemp === '') {
        this.form.gimgMain = 'http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619861009442.jpeg'
      } else if (imgTemp.indexOf(',') === -1) {
        this.form.gimgMain = imgTemp
      } else {
        this.form.gimgMain = imgTemp.split(',')[0]
      }

      this.$http.put(`goods/updateGoodByGid`, this.form).then((res) => {
        const {msg, code} = res.data
        if (code === '0000') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        this.reload()
      }).catch((error) => {
        console.log(error)
      })
    },
    handleUpdate (row) {
      //  显示修改订单信息
      this.centerDialogVisible = true
      // gcomment: (...)
      //   gid: (...)
      // gimg: (...)
      // gimgMain: (...)
      // ginfo: (...)
      // glinepride: (...)
      // gname: (...)
      // gnum: (...)
      // gpride: (...)
      // gsalenum: (...)
      // gsalerId: (...)
      // gsalerName: (...)
      // gtype: (...)
      // id: (...)
      this.form.gid = row.gid
      this.form.gimg = row.gimg
      this.form.ginfo = row.ginfo
      this.form.gname = row.gname
      this.form.gnum = row.gnum
      this.form.gpride = row.gpride
      this.form.glinepride = row.glinepride
      this.form.gimgMain = row.gimgMain

      let rowImg = row.gimg
      if (rowImg === '') {
        this.imgList = []
      } else if (rowImg.indexOf(',') === -1) {
        this.imgList.push({url: rowImg})
      } else {
        let urlArr = rowImg.split(',')
        for (let i = 0; i < urlArr.length; i++) {
          this.imgList.push({url: urlArr[i]})
        }
      }

      this.num = row.gnum
    },
    handleDelete (gId) {
      // 删除
      console.log(gId)
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/deleteOneGood/${gId}`).then((res) => {
          if (res.data.code === '0000') {
            // 更新视图
            this.reload()
            // 提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分页函数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.current = 1
      if (this.searchTF) {
        this.searchGoods()
      } else {
        this.getGoodsList()
      }
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.current = val
      if (this.searchTF) {
        this.searchGoods()
      } else {
        this.getGoodsList()
      }
    },
    setSomething (msg, code, goodsList, total, current, size) {
      //  赋值函数
      console.log('进入赋值函数')
      if (code === '0000') {
        //  赋值表格
        this.tableData = goodsList
        //  给总数赋值
        this.total = parseInt(total)
        this.current = current
        this.size = size
        //  提示成功
        // this.$message.success(msg)
      } else {
        // 只给错误提示
        this.$message.warning(msg)
      }
    },
    async searchGoods () {
      //  查询商品
      // ?current=${this.current}&size=${this.size}&gName=${this.query}
      const res = await this.$http.get(`goods/searchAllGoodsForAdmin`, {
        params: {
          current: this.current,
          size: this.size,
          gName: this.query
        }
      })
      if (this.query === '') {
        this.searchTF = false
      } else {
        this.searchTF = true
      }
      if (res.data.data != null) {
        const {
          data: {goodsList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, goodsList, total, current, size)
      } else {
        this.tableData = []
      }
    },
    async getGoodsList () {
      //  获取数据
      const res = await this.$http.get(`goods/getAllGoods?current=${this.current}&size=${this.size}`)
      if (res.data.data != null) {
        console.log(res.data.data)
        const {
          data: {goodsList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, goodsList, total, current, size)
      } else {
        this.tableData = []
      }
    }
  }
}
</script>

<style >
.search{
  margin-top:30px;
}

.goodsBox-card {
  width: 100%;
  min-width: 1450px;
}

</style>
