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
        <div class="available_score">{{ integralName }}：800</div>
        <div class="block">
          <div class="block2">
            <el-select
              v-model="value1"
              filterable
              clearable
              placeholder="请输入网点名称"
              style="width: 320px"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.val"
                :value="item.val"
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
        :data="list1"
        :header-cell-style="{
          background: '#eee',
          color: '#999',
          'text-align': 'center',
          padding:'0'

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
          prop="a1"
          label="网点名称"
          width="280"
        ></el-table-column>
        <el-table-column
          prop="a2"
          label="可用积分"
          width="200"
        ></el-table-column>
        <el-table-column prop="a3" label="积分类型" width="200">
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
              @click="toDetail(score.row.id)"
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
      list1: [
        {
          a1: "宁波聚联科技有限公司（市代）1",
          a2: "2000",
          a3: "通用积分",
        },
        {
          a1: "宁波聚联科技有限公司（市代）2",
          a2: "2000",
          a3: "通用积分",
        },
        {
          a1: "宁波聚联科技有限公司（市代）3",
          a2: "2000",
          a3: "通用积分",
        },
      ],
      integralName: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo: {},
      loading: false,
      param: {},
      info: {},
      value1: "",
      options: [
        { val: "宁波聚联科技有限公司（市代）1" },
        { val: "宁波聚联科技有限公司（市代）2" },
        { val: "宁波聚联科技有限公司（市代）3" },
        { val: "宁波聚联科技有限公司（市代）4" },
      ],
      type:0,//1:总积分，2:可用积分，3:已使用积分，4:即将到期积分

    };
  },
  async mounted() {
      this.type=Number(this.$route.query.type);
      switch(this.type){
          case 1:
              this.integralName="全部销售网点总积分";
              break;
          case 2:
              this.integralName="全部销售网点可用积分";
              break;
          case 3:
              this.integralName="全部销售网点已使用积分";
              break;

          case 4:
              this.integralName="全部销售网点即将到期积分";
              break;

      }
    // await this.getList();
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
    toDetail(){
      this.$router.push(`./outletScoreDetail?type=${this.type}`);

    },
    async getList() {
      this.param = {
        pageSize: this.pageSize, //每页显示的数据条数
        pageNum: this.pageNum, //第几页
        buyId: this.buyId, //用户账号编号
        agentId: this.agentId,
        extUserIds: this.extUserIds,
        orderStartTime: this.orderStartTime, //下单开始时间
        orderEndTime: this.orderEndTime, //下单结束时间
        customType: this.customType, //1-定制 2-艺术定制 3-专属定制 0-标准
        statusStr: this.status, //0-取消  100-199 为审核的状态
        orderCode: this.orderCode, //erp返回过来的订单编号
        orderType: this.orderType, //订单类型
      };
      let data = await this.api.myOrder(this.param);
      if (data.code == 0) {
        this.loading = false;
        this.total = data.data.total;
        this.list = data.data.result;
        this.list.forEach((item) => {
          item.delieryTime = item.delieryTime
            ? item.delieryTime.split(" ")[0]
            : "";
          item.crtTm = item.crtTm ? item.crtTm.split(" ")[0] : "";
          if (item.isShortTime) {
            item.agentName = `${item.agentName}(临时客户-${item.shortTimeName})`;
          }
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
