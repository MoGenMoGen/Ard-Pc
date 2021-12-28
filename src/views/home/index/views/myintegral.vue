<template>
  <!--我的积分-->
  <div
    class="outer2"
    v-loading="loading"
    element-loading-text="请不要关闭或者刷新页面"
  >
    <div class="top2">
      <p :style="{ borderBottom: showCensus ? '' : '1px solid #e1e1e1' }">
        我的积分<span
          v-show="!showCensus"
          style="margin-left: 5px; font-size: 14px; color: #606060"
          >({{ desc }})</span
        >
        <span
          v-show="!showCensus"
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
      <div class="score_census" v-show="showCensus">
        <div class="item">
          <div class="line1">{{ info.allPoints }}</div>
          <div class="line2" @click="handleScore1">总积分</div>
        </div>
        <div class="item">
          <div class="line1">{{ info.pointsUsed }}</div>
          <div class="line2" @click="handleScore2">已使用积分</div>
        </div>
        <div class="item">
          <div class="line1">{{ info.aboutToExpirePoints }}</div>
          <div class="line2" @click="handleScore3">即将到期积分</div>
        </div>
      </div>
      <div class="select">
        <div class="available_score">
          {{ integralName }}:{{ availablePoints }}
        </div>
        <div class="block">
          <div class="block2">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="dateTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div class="block6">
            <input type="button" @click="toSearch" value="查询" />
          </div>
        </div>
      </div>
    </div>

    <div class="table-header">
      <el-table
        :data="list1"
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
          prop="srcNm"
          label="积分来源"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="orderCode"
          label="订单编号"
          width="140"
        ></el-table-column>
        <el-table-column prop="crtTm" label="日期" width="130">
        </el-table-column>
        <el-table-column width="110" label="扣减积分">
          <template slot-scope="scope">
            <p v-if="scope.row.points < 0">{{ scope.row.points }}</p>
            <p v-else>-</p>
          </template></el-table-column
        >
        <el-table-column width="110" label="奖励积分">
          <template slot-scope="scope">
            <p v-if="scope.row.points > 0">{{ scope.row.points }}</p>
            <p v-else>-</p>
          </template></el-table-column
        >
        <el-table-column width="110" prop="a6" label="积分类型">
          <template slot-scope="scope">
            <p v-if="scope.row.network">专用积分</p>
            <p v-else>通用积分</p>
          </template></el-table-column
        >
        <el-table-column width="130" label="到期时间" prop="validTm">
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
      buyId: "",
      agentId: "",
      extUserIds: "",
      dateTime: "",
      availablePoints: "", //初始可用积分
      list1: [],
      showCensus: true, //显示积分明细
      desc: "",
      integralName: "可用积分",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      st: "", //开始时间
      et: "", //结束时间
      userInfo: {},
      loading: true,
      param: {},
      info: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: "",
      value2: "",
    };
  },
  async mounted() {
    //改成经销商Id
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      if (this.userInfo.userType === 2) {
        this.agentId = this.userInfo.agentInfoId;
      } else {
        this.buyId = this.userInfo.userId;
        this.extUserIds = this.userInfo.extUserIds
          ? this.userInfo.extUserIds
          : "";
      }
    }
    let obj = {
      agentId: this.agentId,
      networkId: "",
    };
    this.info = await this.api.getOneAllPoints(obj);
    this.availablePoints = this.info.availablePoints;
    await this.getList();
  },
  watch: {},
  methods: {
    rowStyle() {
      return "text-align:center";
    },
    changeDate(e) {
      if (e) {
        this.st = e[0];
        this.et = e[1];
      } else {
        this.st = "";
        this.et = "";
      }
    },
    back() {
      this.showCensus = true;
      this.integralName = "可用积分";
      this.availablePoints = this.info.availablePoints;
      this.getList();
    },
    handleScore1() {
      this.showCensus = false;
      this.desc = "总积分";
      this.integralName = this.desc;
      this.availablePoints = this.info.allPoints;
      this.getList();
    },
    handleScore2() {
      this.showCensus = false;
      this.desc = "已使用积分";
      this.integralName = this.desc;
      this.availablePoints = this.info.pointsUsed;
      this.getList();
    },
    handleScore3() {
      this.showCensus = false;
      this.desc = "即将到期积分";
      this.integralName = this.desc;
      this.availablePoints = this.info.aboutToExpirePoints;
      this.getList();
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
    async getList() {
      let data = "";
      // this.param = {
      //       pageNo:this.pageNum,
      //       pageSize:this.pageSize,
      //       agentId:this.agentId,
      //       networkId:''
      // };
      let qry = this.query.new();
      this.query.toW(qry, "agentId", this.agentId, "EQ");
      if (this.st && this.et) {
        this.query.toW(qry, "crtTm", this.st, "gt");
        this.query.toW(qry, "crtTm", this.et, "lt");
      }
      this.query.toP(qry, this.pageNum, this.pageSize);
      let param = this.query.toEncode(qry);
      if (this.integralName == "可用积分") {
        data = await this.api.getAvailablePoints(param);
      } else if (this.integralName == "总积分") {
        data = await this.api.getAllPoints(param);
      } else if (this.integralName == "已使用积分") {
        data = await this.api.getPointsUsed(param);
      } else if (this.integralName == "即将到期积分") {
        data = await this.api.getAboutToExpirePoints(param);
      }
      if (data.code == 0) {
        this.loading = false;
        this.total = data.page.total;
        this.list1 = data.data.list;
        this.list1.forEach((item) => {
          item.crtTm = item.crtTm ? item.crtTm.substring(0, 10) : "";
          item.updTm = item.updTm ? item.updTm.substring(0, 10) : "";
          item.validTm = item.validTm ? item.validTm.substring(0, 10) : "";
        });
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
