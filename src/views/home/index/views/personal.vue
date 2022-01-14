<template>
  <!--个人中心-->
  <div id="personal">
    <div id="top1">
      <span id="name">{{ mydata.realName }}</span>
      <span id="phone">{{ mydata.linkPhone }}</span>
      <span id="date">协议到期日：{{ mydata.validTime }}</span>
    </div>
    <p id="company">{{ mydata.agentInfoName }}</p>
    <div id="manage">
      <a @click="myaccount">账户管理 ></a>
      <!-- <div v-show="showStatic">
        <p @click="toPayDetail">累计订单总额: ￥{{staticData.totalOrderPrice}}</p>
        <p>本年度订单总额: ￥{{staticData.thisYearOrderPrice}}</p>
        <p>本年度已完成订单总额: ￥{{staticData.thisYearEndOrderPrice}}</p>
        <p @click="toPayDetail">累计应付金额: ￥{{staticData.totalOrderPrice}}</p>
        <p @click="toPayDetail">累计已付金额: ￥{{staticData.payedAmountSum}}</p>
        <p @click="toPayDetail">累计待付金额: ￥{{staticData.unpaidAmountSum}}</p>
      </div> -->
    </div>
    <div id="echarts" ref="echarts" v-show="showStatic">
      <order-report ref="orderReport"></order-report>
    </div>

    <div id="bottom">
      <div id="message" class="table1">
        <div class="neikuang" @click="mymessage">
          <img class="neikuang-img" src="../images/wodexiaoxi.png" />
          <div class="neikuang-div">
            <div class="neikuang-div-one">我的消息</div>
            <div class="neikuang-div-two">查看消息详情></div>
          </div>
        </div>
      </div>

      <div id="order" class="table1">
        <div class="neikuang" @click="myorder">
          <img class="neikuang-img" src="../images/wodedingdan.png" />
          <div class="neikuang-div">
            <div class="neikuang-div-one">我的订单</div>
            <div class="neikuang-div-two">查看订单详情></div>
          </div>
        </div>
      </div>
      <div id="integral" class="table1" v-show="showStatic">
        <div class="neikuang" @click="myintegral">
          <img class="neikuang-img" src="../images/jifen.png" />
          <div class="neikuang-div">
            <div class="neikuang-div-one">我的积分</div>
            <div class="neikuang-div-two">查看积分明细></div>
          </div>
        </div>
      </div>
      <div id="address" class="table1">
        <div class="neikuang" @click="myaddress">
          <img class="neikuang-img" src="../images/shouhuodizhi.png" />
          <div class="neikuang-div">
            <div class="neikuang-div-one">收货地址</div>
            <div class="neikuang-div-two">查看全部收货地址></div>
          </div>
        </div>
      </div>
      <div id="feedback" class="table1">
        <div class="neikuang" @click="myfeedback">
          <img class="neikuang-img" src="../images/yijianfankui.png" />
          <div class="neikuang-div">
            <div class="neikuang-div-one">意见反馈</div>
            <div class="neikuang-div-two">提交反馈意见></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderReport from "../components/orderReport";

export default {
  name: "personal",
  methods: {
    mymessage: function () {
      this.$router.push("./message");
    },
    myorder: function () {
      this.$router.push("./order");
    },
    myintegral: function () {
      this.$router.push("./integral");
    },
    myaddress: function () {
      this.$router.push("./myaddress");
    },
    myfeedback: function () {
      this.$router.push("./feedback");
    },
    myaccount: function () {
      this.$router.push("./account");
    },
    async getOrderStatisData(code) {
      const param = { agentInfoCode: code };
      this.staticData = await this.api.getSysOrderStatisData(param);
    },
    toPayDetail() {
      this.$router.push("./paydetail");
    },
    async getData() {
      let sum1 = 0;
      let sum2 = 0;
      let sum3 = 0;
      let data = await this.api.getMyCenter();
      console.log(111,data);
      sum1 = data.reduce((sum, item) => sum + Number(item[1]), 0);
      sum2 = data.reduce((sum, item) => sum + Number(item[2]), 0);
      sum3 = data.reduce((sum, item) => sum + Number(item[3]), 0);
      console.log(222,data);
      let str1 = "product";
      let str2 = `累计订单总额：${sum1}元`;
      let str3 = `本年度订单总额：${sum2}元`;
      let str4 = `本年度已完成订单总额：${sum3}元`;
      let arr = [];
      arr.push(str1, str2, str3, str4);
      console.log(arr);
      let source = [arr, ...data];
      console.log(333,source);
      this.$refs.orderReport.getData(source);
    },
  },
  data() {
    return {
      mydata: {},
      showStatic: false,
      staticData: {},
    };
  },
  components: {
    orderReport,
  },
  async mounted() {
    console.log("进入我的个人中心:");

    let res = await this.api.getPersonalInformation();
    console.log("个人中心返回：");
    console.log(1111111,res);
    this.mydata = res.data.userInfo;
    if (this.mydata.userType === 2) {
      this.showStatic = true;
      this.getData();
      // this.getOrderStatisData(this.mydata.agentInfoCode);
    } else {
      this.showStatic = false;
    }
    console.log(res.data.userInfo);
  },
};
</script>

<style scoped lang="less">
.neikuang-div-two {
  margin-top: 12px;
  align-items: center;
  color: #666666;
  font-size: 13px;
  text-align: left;
}
.neikuang-div-one {
  margin-top: 10px;
  align-items: center;
  color: #333333;
  font-size: 16px;
  text-align: left;
}
.neikuang-img {
  float: left;
  cursor: pointer;
}
.neikuang-div {
  float: left;
  margin-left: 20px;
  cursor: pointer;
}
img {
  width: 69px;
  height: 69px;
}
.neikuang {
  margin-left: 57px;
  margin-top: 57px;
}
#bottom {
  display: flex;
  flex-wrap: wrap;
}
.table1 {
  display: flex;
  flex-wrap: wrap;
  width: 33.3%;
  height: 50%;
}
#echarts {
  width: 950px;
}

#personal {
  // padding-top: 14px;
  padding: 44px 67px 40px 40px;
  box-sizing: border-box;
  // height: 606px;
  width: 950px;
  background: white;
}

#name {
  margin-left: 60px;
  color: #666666;
  font-size: 18px;
}
#phone {
  margin-left: 60px;
  font-size: 14px;
  color: #999999;
}
#date {
  margin-left: 338px;
  color: #999999;
  font-size: 14px;
}
#company {
  margin-left: 60px;
  margin-top: 29px;
  color: #666666;
  font-size: 18px;
}
#manage {
  padding: 27px 0 25px 60px;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  flex-flow: column wrap;
  border-bottom: 1px solid #e1e1e1;
  a {
    flex: 1;
    color: #2196f3;
    cursor: pointer;
  }
  div {
    margin-top: 20px;
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    font-size: 16px;
    p {
      width: 30%;
      cursor: pointer;
      &:nth-of-type(n + 4) {
        margin-top: 10px;
      }
    }
  }
}
</style>
