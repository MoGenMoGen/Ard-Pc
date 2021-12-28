<template>
  <!--网点积分汇总-->
  <div
    class="outer2"
    v-loading="loading"
    element-loading-text="请不要关闭或者刷新页面"
  >
    <div class="top2">
      <p style="border-bottom: 1px solid #e1e1e1">
        网点积分汇总
        <span
          style="
            float: right;
            margin-right: 30px;
            display: inline-block;
            font-size: 16px;
            color: #999999;
            cursor: pointer;
          "
          @click="back"
          >< 返回</span
        >
      </p>
      <div class="select">
        <div class="available_score">{{ integralName }}：{{ Score }}</div>
        <div class="block">
          <div class="block2">
            <el-select
              v-model="networkNm"
              filterable
              clearable
              placeholder="请输入网点名称"
              style="width: 320px"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="block6">
            <input type="button" @click="toSearch" value="查询" />
          </div>
        </div>
      </div>
    </div>

    <div class="table-header">
      <el-table
        :data="list"
        :header-cell-style="{
          background: '#eee',
          color: '#999',
          'text-align': 'center',
          padding: '0',
        }"
        :cell-style="rowStyle"
        style="width: 100%; text-align: center"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="network"
          label="网点名称"
          width="280"
        ></el-table-column>
        <el-table-column
          :prop="scoreVal"
          :label="scoreNm"
          width="200"
        ></el-table-column>
        <el-table-column label="积分类型" width="200">
          专用积分
        </el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="score">
            <div
              style="
                font-size: 14px;
                text-decoration: underline;
                color: #ff9801;
                hover {
                  cursor: pointer;
                }
              "
              @click="toDetail(score.row.networkId)"
            >
              查看详情
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageInfo">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "integral",
  data() {
    return {
      list: [],
      Score: "",
      scoreNm: "",
      scoreVal: "",
      integralName: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo: {},
      loading: false,
      param: {},
      info: {},
      networkNm: "",
      options: [],
      type: 0, //1:总积分，2:可用积分，3:已使用积分，4:即将到期积分
    };
  },
  async mounted() {
    this.type = Number(this.$route.query.type);
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
    //获取所有网点积分统计数据
    this.info = await this.api.getOneAllNetworkPoints();

    switch (this.type) {
      case 1:
        this.integralName = "全部销售网点总积分";
        this.scoreNm = "总积分";
        this.scoreVal = "allPoints";
        this.Score = this.info.allPoints;
        break;
      case 2:
        this.integralName = "全部销售网点可用积分";
        this.scoreNm = "可用积分";
        this.scoreVal = "availablePoints";
        this.Score = this.info.availablePoints;
        break;
      case 3:
        this.integralName = "全部销售网点已使用积分";
        this.scoreNm = "已使用积分";
        this.scoreVal = "pointsUsed";
        this.Score = this.info.pointsUsed;
        break;
      case 4:
        this.integralName = "全部销售网点即将到期积分";
        this.scoreNm = "即将到期积分";
        this.scoreVal = "aboutToExpirePoints";
        this.Score = this.info.aboutToExpirePoints;
        break;
    }
    //网点列表
    let res = await this.api.getNetwork({ pageNum: 1, pageSize: 1000 });
    console.log({ res });
    this.options = res.data.records.map((item) => item.crmNetworkVo.name);
    await this.getList();
  },
  watch: {},
  methods: {
    rowStyle() {
      return "text-align:center";
    },
    back() {
      this.$router.back();
    },
    handleCurrentChange(e) {
      this.loading = true;
      this.pageNum = e;
      this.getList();
    },
    handleSizeChange(val) {
      this.loading = true;
      this.pageSize = val;
      this.pageNum = 1;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    toSearch() {
      this.pageNum = 1;
      this.getList();
    },
    toDetail(id) {
      this.$router.push(`./outletScoreDetail?id=${id}&type=${this.type}`);
    },
    async getList() {
      this.param = {
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userInfo.userId,
      };
      if (this.networkNm) this.param.name = this.networkNm;
      let data = await this.api.getNetWorkScoreList(this.param);
      if (data.code == 0) {
        this.loading = false;
        this.total = data.data.total;
        this.list = data.data.records;
      }
    },
  },
  components: {},
};
</script>
<style scoped>
.btn {
  background: #f6a33e;
  color: #ffffff;
  text-align: center;
  margin: 8px 0;
  cursor: pointer;
}
</style>
<style lang="less">
.table-header tr {
  cursor: pointer;
}
.block2 {
  .el-date-editor {
    width: 270px;
  }
}
</style>
<style scoped lang="less">
/*最外层布局*/
.outer2 {
  padding-top: 14px;
  width: 950px;
  background: white;
}
/*顶部布局*/
.top2 {
  // padding-left: 15px;
  font-size: 18px;
  color: #333333;
  line-height: 70px;
  border-bottom: 1px solid #e1e1e1;
}
/*我的订单段落*/
.top2 p {
  display: block;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
}
// 积分统计
.score_census {
  width: 100%;
  height: 123px;
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item {
    height: 123px;
    line-height: 0;
    padding: 50px 0 29px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .line1 {
      font-size: 30px;
      color: #ff3000;
      text-align: center;
      line-height: 0;
    }
    .line2 {
      font-size: 16px;
      text-decoration: underline;
      color: #606060;
      text-align: center;
      line-height: 0;
      cursor: pointer;
    }
  }
}

/*时间选择器外层布局*/
.select {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  .available_score {
    font-size: 16px;
    color: #ff3000;
  }
  .block {
    display: flex;
  }
}
/*下拉列表*/
.block3 {
  margin-left: 10px;
  flex: 1;
}
/*下拉列表*/
.block4 {
  margin-left: 10px;
  flex: 1;
}
/*右侧搜索文本布局*/
.block5 {
  margin-left: 10px;
  flex: 1;
}
/*右侧搜索文本*/
.block5 input {
  outline: none;
  border: 1px solid #d1dbe5;
  color: #999999;
  font-size: 14px;
  padding-left: 10px;
  height: 34px;
  border-radius: 4px;
}
/*右侧搜索按钮布局*/
.block6 {
  margin-left: 20px;
  width: 100px;
  margin-right: 10px;
}
/*右侧搜索按钮*/
.block6 input {
  height: 36px;
  border-radius: 4px;
  padding-left: 33px;
  padding-right: 33px;
  color: white;
  font-size: 18px;
  background: #f6a33e;
  outline: none;
  border: 0;
  cursor: pointer;
}
.nav1 {
  margin-left: 0px;
  width: 100%;
  margin-top: 0px;
  padding-bottom: 0px;
  padding-top: 0;
  margin-bottom: 0;
  height: 60px;
  line-height: 60px;
  display: flex;
  display: -webkit-flex;
  p {
    flex: 1;
    text-align: center;
    border-bottom: 1px solid #e4e4e4;
    cursor: pointer;
  }
  p.active {
    color: #f6a33e;
    border-bottom: 2px solid #f6a33e;
  }
}

/*表头*/
.table-header {
  margin-left: 0px;
  width: 950px;
  margin-top: 0px;
  padding-bottom: 0px;
  padding-top: 0;
  margin-bottom: 0;
  height: 50px;
  background: #eeeeee;
  display: table;
  line-height: 50px;
}
.pageInfo {
  padding: 20px;
}
</style>
