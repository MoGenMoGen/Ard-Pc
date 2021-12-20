<template>
  <!--我的积分-->
  <div
    class="outer2"
    v-loading="loading"
    element-loading-text="请不要关闭或者刷新页面"
  >
    <div class="top2">
      <p>我的积分</p>
      <div class="score_census">
        <div class="item">
          <div class="line1">10000</div>
          <div class="line2">总积分</div>
        </div>
        <div class="item">
          <div class="line1">2000</div>
          <div class="line2">已使用积分</div>
        </div>
        <div class="item">
          <div class="line1">1000</div>
          <div class="line2">即将到期积分</div>
        </div>
      </div>
      <div class="select">
        <div class="available_score">可用积分:800</div>
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
          prop="a1"
          label="积分来源"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="a2"
          label="订单编号"
          width="140"
        ></el-table-column>
        <el-table-column prop="a3" label="日期" width="130"> </el-table-column>
        <el-table-column
          width="110"
          prop="a4"
          label="扣减积分"
        ></el-table-column>
        <el-table-column
          width="110"
          prop="a5"
          label="奖励积分"
        ></el-table-column>
        <el-table-column
          width="110"
          prop="a6"
          label="积分类型"
        ></el-table-column>
        <el-table-column width="130" label="到期时间" prop="a7">
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
    <el-dialog
      title="订单明细"
      width="70%"
      :visible.sync="orderListDialog"
      :close-on-click-modal="false"
      @close="getList"
    >
      <order-list
        @closeOrderDetail="closeDialog"
        @refresh="refreshAll(info)"
        :info="info"
      ></order-list>
    </el-dialog>
    <el-dialog
      title="订单变更"
      width="70%"
      :visible.sync="orderChange"
      :close-on-click-modal="false"
      @close="getList"
    >
      <order-change-num
        @closeOrderDetail="closeDialog"
        @refresh="refreshAll2(info)"
        :info="info"
      ></order-change-num>
    </el-dialog>
  </div>
</template>

<script>
import OrderList from "../components/OrderList";
import OrderChangeNum from "../components/OrderChangeNum";
export default {
  name: "order",
  data() {
    return {
      uuid: "",
      loop: "",
      orderChange: false,
      dateTime: "",
      list: [],
      list1: [
        {
          a1: "业绩奖励",
          a2: "202112058-皖",
          a3: "2021-11-12",
          a4: "-50",
          a5: "2000",
          a6: "通用积分",
          a7: "2022-12-06",
        },
        {
          a1: "业绩奖励",
          a2: "202112058-皖",
          a3: "2021-11-12",
          a4: "-50",
          a5: "2000",
          a6: "通用积分",
          a7: "2022-12-06",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      buyId: "", //用户账号编号
      agentId: "",
      extUserIds: "",
      orderStartTime: "", //下单开始时间
      orderEndTime: "", //下单结束时间
      orderType: "", //订单顾炎武
      customType: "", //1-定制 2-艺术定制 3-专属定制 0-标准
      status: "", //0-取消  100-199 为审核的状态
      orderCode: "", //erp返回过来的订单编号,前端只用orderCode 2019年12月6日 肖工
      userInfo: {},
      orderStatis: {},
      loading: true,
      orderListDialog: false,
      param: {},
      info: {},
      statusList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0,60,70,80",
          label: "待评审",
        },
        {
          value: "5,90",
          label: "待生产",
        },
        {
          value: "10,20,30,40",
          label: "开始生产",
        },
        {
          value: "50",
          label: "已发货",
        },
        {
          value: "99",
          label: "已完成",
        },
        {
          value: "-1",
          label: "已取消",
        },
      ],
      orderTypeList: [],
      vipType: [
        {
          //定制类型
          value: "1",
          label: "定制",
        },
        {
          value: "2",
          label: "艺术定制",
        },
        {
          value: "3",
          label: "专属定制",
        },
        {
          value: "0",
          label: "标准",
        },
      ],
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
    await this.getList();
    await this.getOrderCount();
    await this.getOrderTypeList();
  },
  watch: {
    status: function (e) {
      console.log(e);
      this.pageNum = 1;
      this.getList();
    },
  },
  methods: {
    rowStyle() {
      return "text-align:center";
    },
    //复制订单
    toCopy(id) {
      this.$router.push({
        //你需要接受路由的参数再跳转
        path: "/shop/order",
        query: {
          id: id,
        },
      });
    },
    //变更订单弹窗显示
    async changeOrder(info) {
      this.info = await this.api.getOrdInfo(info.id);

      this.orderChange = true;
    },
    async closeDialog(val) {
      this.orderListDialog = false;
      await this.getList();
      await this.getOrderCount();
    },
    async refreshAll(info) {
      await this.toDetail(info);
      await this.getList();
    },
    async refreshAll2() {
      this.orderChange = false;
      await this.getList();
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
    async toDetail(e) {
      /*   this.$router.push({
          //你需要接受路由的参数再跳转
          path: "orderlist",
          query: {
            id: e.id
          }
        }); */
      this.orderListDialog = true;
      this.info = await this.api.getOrdInfo(e.id);
    },
    toSearch() {
      this.pageNum = 1;
      this.getList();
    },
    async getOrderTypeList() {
      this.orderTypeList = await this.api.getBaseDictionaryList("orderType");
    },
    exptsearch() {
      this.param = {
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
      this.until
        .get(
          "/crm/orderExpt/expt?buyId=" +
            this.buyId +
            "&agentId=" +
            this.agentId +
            "&orderStartTime=" +
            this.orderStartTime +
            "&extUserIds=" +
            this.extUserIds +
            "&orderEndTime=" +
            this.orderEndTime +
            "&customType=" +
            this.customType +
            "&statusStr=" +
            this.status +
            "&orderCode=" +
            this.orderCode +
            "&orderType=" +
            this.orderType
        )
        .then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.loading = true;
          this.uuid = res.data;
          console.log(this.uuid);
          this.loop = setInterval(() => {
            this.testsss();
          }, 2000);
        });
    },
    testsss() {
      this.until.get("/crm/order/expt222?uuid=" + this.uuid).then((res) => {
        if (res.code !== 0) {
          this.loading = false;
          clearInterval(this.loop);
          return this.$message.error(res.msg);
        }
        if (res.data === 1) {
          this.loading = false;
          clearInterval(this.loop);
          this.until
            .getAxios("/crm/order/down?uuid=" + this.uuid, {
              responseType: "arraybuffer",
            })
            .then((response) => {
              var date = new Date();
              var file =
                date.getFullYear() +
                "年" +
                (date.getMonth() + 1) +
                "月" +
                date.getDate() +
                "订单信息表.xls";
              let a = document.createElement("a");
              let blob = new Blob([response.data], { responseType: "blob" });
              let objectUrl = URL.createObjectURL(blob);
              a.setAttribute("href", objectUrl);
              a.setAttribute("download", file);
              a.click();
              a.remove();

              window.URL.revokeObjectURL(objectUrl);
            });
        }
      });
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
    async getOrderCount() {
      this.orderStatis = await this.api.getDiffrentStatusOrderCount(this.param);
      this.statusList.forEach((item, index) => {
        if (index === 1) {
          item.labelPlus = `${item.label}(${this.orderStatis.dsh})`;
        }
        if (index === 2) {
          item.labelPlus = `${item.label}(${this.orderStatis.dsc})`;
        }
        if (index === 3) {
          item.labelPlus = `${item.label}(${this.orderStatis.startSc})`;
        }
        if (index === 4) {
          item.labelPlus = `${item.label}(${this.orderStatis.yfh})`;
        }
        if (index === 5) {
          item.labelPlus = `${item.label}(${this.orderStatis.finish})`;
        }
        if (index === 6) {
          item.labelPlus = `${item.label}(${this.orderStatis.cancel})`;
        }
        this.$set(this.statusList, index, item);
      });
    },
  },
  components: {
    OrderList,
    OrderChangeNum,
  },
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
    }
  }
}

/*时间选择器外层布局*/
.select {
  width: 100%;
  padding: 30px;
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
