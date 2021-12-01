<template>
  <!--付款详情-->
  <div class="outer">
    <div class="div-top">
      <p class="title">付款详情</p>
      <div class="div-search">
        订单编号：
        <input type="text" placeholder="订单编号查询" v-model="erpCode" @keyup.enter="search" />
        <button @click="search">查询</button>
      </div>
    </div>
    <ul>
      <li>
        <div class="table-header">
          <p class="first-item">订单编号</p>
          <p>订单总额</p>
          <p>已付</p>
          <p>待付</p>
          <p>操作</p>
        </div>
      </li>

      <li v-for="msg in msgList" :key="msg.id">
        <div class="container">
          <p>{{msg.orderCode}}</p>
          <p>￥{{msg.totalAmount}}</p>
          <p>￥{{msg.payedAmount}}</p>
          <p>￥{{msg.totalAmount-msg.payedAmount}}</p>
          <p v-if="msg.payedAmount>0" @click="toPayLog(msg.id)">查看</p>
          <p v-else></p>
        </div>
      </li>
      <!-- 合计 -->
      <li>
        <div class="container">
          <p>合计</p>
          <p>￥{{statistics.totalAmountSum}}</p>
          <p>￥{{statistics.payedAmountSum}}</p>
          <p>￥{{statistics.unpaidAmountSum}}</p>
          <p></p>
        </div>
      </li>
    </ul>
    <div class="footer1">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <pay-log :payLogVisible="payLogVisible" :id="orderId" @closePayLog="closePayLogOp"></pay-log>
  </div>
</template>

<script>
  import PayLog from "../components/PayLog";
  export default {
    name: "paydetail",
    data() {
      return {
        msgList: [],
        pageNum: 1,
        total: 0,
        pageSize: 10,
        erpCode: "",
        orderId: 0,
        userInfo: {},
        statistics: {},
        payLogVisible: false
      };
    },
    methods: {
      async search() {
        this.pageNum = 1;
        this.msgList=[]
        this.getPayList();
      },
      //点击处理当前页,定义的时候没有参数，调用的时候回自动加一个e
      async handleCurrentChange(e) {
        this.pageNum = e;
        this.getPayList();
      },
      async handleSizeChange(val) {
        this.pageSize = val;
        this.pageNum = 1;
        this.getPayList();
      },
      async getPayList() {
        const qry = new this.Query();
        if (this.userInfo.userType === 2) {
          qry.buildWhereClause("agentId", this.userInfo.agentInfoId, "EQ");
        } else {
          qry.buildWhereClause("buyId", this.userInfo.userId, "EQ");
        }

        if (this.erpCode) {
          qry.buildWhereClause("orderCode", this.erpCode, "LK");
        }
        const param = qry.getParam();
        const res = await this.api.getPayListAccordingToUser(param);
        const { page, statistics } = { ...res };
        this.total = page.total;
        this.statistics = statistics;

        const records = page.records.map(item => item.crmOrderVo);
        this.msgList.push(...records);
      },
      toPayLog(id) {
        this.orderId = id;
        this.payLogVisible = true;
      },
      closePayLogOp(val) {
        this.payLogVisible = val;
      }
    },
    async mounted() {
      this.userInfo = JSON.parse(this.until.loGet("userInfo"));
      this.getPayList();
    },
    components: {
      PayLog
    }
  };
</script>

<style scoped lang="less">
  /*最外层布局*/
  .outer {
    padding-top: 14px;
    min-height: 530px;
    width: 950px;
    background: white;
  }
  /*顶部布局*/
  .div-top {
    padding-left: 35px;
    width: 914px;
    height: 80px;
    border-bottom: 1px solid #e1e1e1;
  }
  /*顶部左侧标题*/
  p.title {
    margin-top: 20px;
    color: #333;
    font-size: 18px;
    float: left;
  }
  /*搜索布局*/
  .div-search {
    float: right;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    margin-right: 30px;
  }
  /*搜索框*/
  .div-search input {
    width: 210px;
    height: 50px;
    padding-left: 21px;
    border: 1px solid #dfdfdf;
  }
  /*搜索按钮*/
  .div-search button {
    width: 156px;
    height: 50px;
    font-size: 18px;
    background: #ff9801;
    color: #ffffff;
    margin-left: 30px;
    cursor: pointer;
  }
  /*表头*/
  .table-header {
    width: 950px;
    height: 50px;
    background: #eeeeee;
    display: flex;
    line-height: 50px;
    padding-left: 120px;
    box-sizing: border-box;
  }
  /*表头文字*/
  .table-header p {
    flex: 1;
    color: #999999;
    font-size: 14px;
  }

  /*列表布局，父级盒子*/
  .container {
    width: 950px;
    height: 60px;
    border-bottom: 1px solid #e1e1e1;
    display: flex;
    line-height: 60px;
    box-sizing: border-box;
    padding-left: 120px;
  }
  .container:hover {
    background: whitesmoke;
  }
  li {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .container {
    p {
      flex: 1;
      color: #666666;
      font-size: 14px;
      &:nth-last-of-type(1) {
        cursor: pointer;
      }
    }
  }
  .footer1 {
    margin-top: 40px;
    padding-left: 35px;
    width: 914px;
    height: 75px;
  }
</style>
