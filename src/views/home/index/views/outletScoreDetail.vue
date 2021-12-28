<template>
  <!--网点积分详情-->
  <div
    class="outer2"
    v-loading="loading"
    element-loading-text="请不要关闭或者刷新页面"
  >
    <div class="top2">
      <p class="name" style="border-bottom: 1px solid #e1e1e1">
        {{ userInfo.corpName }}
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
      <div class="info">
        <p>联系人：{{ userInfo.linkMan }}</p>
        <p>联系电话：{{ userInfo.linkPhone }}</p>
        <p>收货地址：{{ userInfo.address }}</p>
      </div>
      <div class="select">
        <div class="available_score">{{ integralName }}：{{ Score }}</div>
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
        @row-click="toDetail"
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
      dateTime: "",
      id: "",
      list1: [],
      integralName: "",
      Score: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo: {},
      loading: false,
      type: 0, //1:总积分，2:可用积分，3:已使用积分，4:即将到期积分
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
    };
  },
  async mounted() {
    this.type = Number(this.$route.query.type);
    this.id = Number(this.$route.query.id);
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }

    switch (this.type) {
      case 1:
        this.integralName = "总积分";
        break;
      case 2:
        this.integralName = "可用积分";
        break;
      case 3:
        this.integralName = "已使用积分";
        break;
      case 4:
        this.integralName = "即将到期积分";
        break;
    }

    await this.getList();
  },
  watch: {},
  methods: {
    rowStyle() {
      return "text-align:center";
    },
    changeDate(e) {
      if (e) {
        this.orderStartTime = e[0];
        this.orderEndTime = e[1];
      } else {
        this.orderStartTime = "";
        this.orderEndTime = "";
      }
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
    toDetail() {},
    async getList() {
      let data = "";
      let qry = this.query.new();
      this.query.toW(qry, "networkId", this.id, "EQ");
      if (this.st && this.et) {
        this.query.toW(qry, "crtTm", this.st, "gt");
        this.query.toW(qry, "crtTm", this.et, "lt");
      }
      this.query.toP(qry, this.pageNum, this.pageSize);
      let param = this.query.toEncode(qry);
      if (this.type == 2) {
        data = await this.api.getAvailablePoints(param);
      } else if (this.type == 1) {
        data = await this.api.getAllPoints(param);
      } else if (this.type == 3) {
        data = await this.api.getPointsUsed(param);
      } else if (this.type == 4) {
        data = await this.api.getAboutToExpirePoints(param);
      }
      if (data.code == 0) {
        this.loading = false;
        this.Score = data.sum;
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
<style scoped lang="less">
.btn {
  background: #f6a33e;
  color: #ffffff;
  text-align: center;
  margin: 8px 0;
  cursor: pointer;
}
.el-table {
  /deep/ th {
    // padding: 0;
  }
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
  //   line-height: 70px;
  border-bottom: 1px solid #e1e1e1;
  .info {
    padding: 26px 165px 26px 37px;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;

    p {
      font-size: 14px;
      color: #666666;
    }
    p:nth-child(1) {
      display: inline-block;
    }
    p:nth-child(2) {
      display: inline-block;
      float: right;
    }
    p:nth-child(3) {
      margin-top: 19px;
    }
  }
}
/*我的订单段落*/
.top2 .name {
  display: block;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
  line-height: 70px;
  height: 70px;
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
