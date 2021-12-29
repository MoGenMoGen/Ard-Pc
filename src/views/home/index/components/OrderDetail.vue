<template>
  <div class="detail">
    <div class="state1">
      <p v-if="info.status == 0">订单状态：待客服评审</p>
      <p v-if="info.status == 5">订单状态：已同步MES</p>
      <p v-if="info.status == -1">订单状态：已取消！</p>
      <p v-if="info.status == -2">订单状态：客服评审未通过！</p>
      <p v-if="info.status == 10">订单状态：评审通过下料中！</p>
      <p v-if="info.status == 20 || info.status == 30 || info.status == 40">
        订单状态：待发货！
      </p>
      <p v-if="info.status == 50">订单状态：待收货！</p>
      <p v-if="info.status == 60">订单状态：技术评审！</p>
      <p v-if="info.status == 70">订单状态：客服评审！</p>
      <p v-if="info.status == 80">订单状态：生管评审！</p>
      <p v-if="info.status == 90">订单状态：待同步ERP！</p>
      <p v-if="info.status == 99">订单状态：已完成！</p>
      <!-- <p @click="toLogistics()" v-if="info.status==50 || info.status==99">查看物流 ></p> -->
    </div>
    <div class="container1">
      <div class="title2">订单信息</div>
      <div class="detail1">
        <p>
          <span>订单编号：</span>
          {{ info.orderCode }}
        </p>
        <p v-for="item in orderTypeList" v-if="info.orderType == item.cd">
          <span>订单类型：</span>{{ item.nm }}
        </p>
        <p>
          <span>订单报备：</span>
          {{ info.reportName }}项目报备
        </p>

        <p>
          <span>期望交期：</span>
          {{ info.delieryTime }}
        </p>
        <p>
          <span>logo数量：</span>
          {{ info.logoNum }}
        </p>
        <p>
          <span>经销商名称：</span>
          {{ info.agentName }}
        </p>
        <p>
          <span>营业网点信息：</span>
          {{ info.networkName }}
        </p>
      </div>

      <div class="title2">收货地址</div>
      <div class="address-header">
        <span class="_span1">收货人</span>
        <span class="_span2">所在地区</span>
        <span class="_span3">详细地址</span>
        <!--<span class="_span4">邮编</span>-->
        <span class="_span5">手机号码</span>
      </div>
      <div class="address-body">
        <span class="_span1">{{ info.receiver }}</span>
        <span class="_span2">{{ info.orderAreaName }}</span>
        <span class="_span3">{{ info.receiveAddress }}</span>
        <!--<span class="_span4">315200</span>-->
        <span class="_span5">{{ info.receiverPhone }}</span>
      </div>
      <div class="express-pay">
        <p v-if="info.payLogisticsFeeType == 1">物流费用：月付</p>
        <p v-if="info.payLogisticsFeeType == 2">物流费用：到付</p>
        <p v-if="info.payLogisticsFeeType == 3">物流费用：平台垫付</p>
      </div>
      <div class="express-pay">
        <p v-for="item in expressTypeList" v-if="item.cd == info.expressType">
          快递类型：{{ item.nm }}
        </p>
      </div>
      <div class="title2">订单信息</div>
      <div class="table-header">
        <span class="span1">序号</span>
        <span class="span2">产品名称</span>
        <span class="span3">定制属性</span>
        <span class="span5">定制类型</span>
        <span class="span6">单价(元)</span>
        <span class="span10">激光切割费单价</span>
        <span class="span7">其他费用</span>
        <span class="span7">数量</span>
        <span class="span8">金额(元)</span>
        <span class="span9">安装位置</span>
        <span class="span9">备注(其它)</span>
        <span class="span9">其他产品信息</span>
        <span class="span9">附件</span>
      </div>
      <div class="list">
        <ul>
          <li
            v-for="(item, index) in info.orderItemList"
            :key="item.id"
            class="item"
          >
            <div class="div1">{{ index + 1 }}</div>
            <div class="div2">{{ item.productName }}</div>
            <div class="div3">
              <p v-for="(v, i) in item.productAttributeList" :key="i">
                {{ v.attributeKeyName }}：{{ v.attributeValueName }}
              </p>
            </div>

            <div class="div5" v-if="item.productType == 1">定制</div>
            <div class="div5" v-else-if="item.productType == 2">艺术定制</div>
            <div class="div5" v-else-if="item.productType == 3">专属定制</div>
            <div class="div5" v-else-if="item.productType == 0">标准</div>
            <div class="div5" v-else></div>
            <div class="div6" v-if="!notShowTotal">{{ item.productPrice }}</div>
            <div class="div6" v-else></div>
            <div class="div10" v-if="!notShowTotal">{{ item.cutPrice }}</div>
            <div class="div10" v-else></div>
            <div class="div7" v-if="!notShowTotal">{{ item.extPrice }}</div>
            <div class="div7" v-else></div>
            <div class="div7">{{ item.orderNum }}</div>
            <div class="div8" v-if="!notShowTotal">
              {{ item.productAmount }}
            </div>
            <div class="div8" v-else></div>
            <!--列表项中的操作-->
            <div class="div9">
              <p>{{ item.installSite }}</p>
            </div>
            <div class="div9">
              <p>{{ item.remark }}</p>
            </div>
            <div class="div9">
              <p>{{ item.remarkProduct }}</p>
            </div>
            <div class="div9">
              <a
                href="javascript:;"
                v-if="item.shapeImgUrl != null && item.shapeImgUrl != ''"
                target="_blank"
                v-for="(item2, index) in (item.shapeImgUrl || '').split(',')"
                :key="index"
                @click="openFile(item2)"
                >附件{{ index + 1 }}</a
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom1" v-if="ordertype == 1">
        <span class="span1">合计：</span>
        <span class="span2"></span>
        <span class="span3"></span>
        <span class="span5"></span>
        <span class="span6"></span>
        <span class="span10"></span>
        <span class="span7"></span>

        <span class="span7">{{ totalNum }}</span>
        <span v-if="!notShowTotal" class="span8">{{ info.totalAmount }}</span>
        <span class="span8" v-else></span>
        <span class="span9"></span>
        <span class="span9"></span>
        <span class="span9"></span>
        <span class="span9"></span>
      </div>
      <!-- 常规商品才有积分抵扣 -->
      <div class="money_detail" v-show="info.orderType == 2 && !notShowTotal">
        <div class="money_item">
          <div class="left">商品合计：</div>
          <div class="right">￥{{ info.totalAmount.toFixed(2) }}</div>
        </div>
        <div class="money_item">
          <div class="left">积分抵扣：</div>
          <div class="right">-￥{{ info.points.toFixed(2) }}</div>
        </div>
        <div class="money_item">
          <div class="left">应付金额：</div>
          <div class="right" style="color: #ff2a00">
            ￥{{ ( info.totalAmount - info.points).toFixed(2) }}
          </div>
        </div>
      </div>
      <div class="title2">
        备注
        <span class="beizhu">{{ info.remark }}</span>
      </div>

      <div class="title3">审核信息</div>
      <div class="approve-list" v-for="item in checkList" :key="item.id">
        <div>
          <p>审核人：</p>
          <p>{{ item.checker }}</p>
        </div>
        <div>
          <p>审核时间：</p>
          <p>{{ item.crtTm }}</p>
        </div>
        <div>
          <p>审核备注：</p>
          <p>{{ item.remark }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderdetail",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      orderTypeList: [],
      expressTypeList: [],
      id: "",
      totalAmount: 0,
      ordertype: "1",
      checkList: [],
      // scoreDiscount: 0, //积分抵扣占比
    };
  },
  async mounted() {
    // let res = await this.api.getMaxRate();
    // this.scoreDiscount = Number(res.data) / 100;
    // console.log(this.scoreDiscount);
    await this.getInfo();
  },
  watch: {
    "info.id"(val) {
      this.getOrderCheckList(val);
      this.getExpressTypeList();
    },
  },
  computed: {
    // 计算是否显示总金额
    notShowTotal() {
      return (
        this.info.status === -2 ||
        this.info.status === -1 ||
        this.info.status === 0 ||
        this.info.status === 60 ||
        this.info.status === 70 ||
        this.info.status === 80
      );
    },
    totalNum() {
      if (this.info.orderItemList) {
        return this.info.orderItemList.reduce((p, n) => {
          return p + n.orderNum;
        }, 0);
      }
    },
  },
  methods: {
    async getInfo() {
      if (this.info) {
        if (this.info.isShortTime) {
          this.info.agentName = `${this.info.agentName}(临时客户-${this.info.shortTimeName})`;
        }
        if (this.info.orderItemList) {
          this.info.orderItemList.map((item) => {
            item.productPrice = item.productPrice ? item.productPrice : 0;

            item.productAmount = item.productPrice
              ? item.productPrice * item.orderNum
              : 0;
          });
        }
        await this.getOrderTypeList();
        this.info.delieryTime = this.info.delieryTime
          ? this.info.delieryTime.split(" ")[0]
          : "";
        // console.log(data)
      }
    },
    async getExpressTypeList() {
      this.expressTypeList = await this.api.getBaseDictionaryList(
        "express_type"
      );
    },
    async getOrderTypeList() {
      this.orderTypeList = await this.api.getBaseDictionaryList("orderType");
    },
    async getOrderCheckList(id) {
      const param = {
        orderId: id,
      };

      const res = await this.api.getSysOrderCheckList(param);
      this.checkList = (res && res[0].crmOrderCheckInfoVoList) || [];
      if (this.checkList.length > 0) {
        this.checkList.forEach((item) => {
          item.crtTm = item.crtTm.substring(0, 10);
        });
      }
    },
    openFile(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
/*最外层布局*/
.outer {
  margin: 0px auto;
  width: 1200px;
  margin-bottom: 67px;
}
/*标题*/
.title {
  color: #999999;
  font-size: 18px;
  margin: 30px 0 30px 30px;
  span {
    &:nth-of-type(1) {
      cursor: pointer;
    }
  }
}
/*状态*/
.state1 {
  padding: 20px 0;
  width: 100%;
  background: #eee;
  p {
    color: #333;
    font-size: 18px;
    margin-left: 31px;
    &:nth-last-of-type(1) {
      margin-top: 20px;
    }
  }
}
.container1 {
  background: white;
  padding: 0 32px 30px 32px;
}
/*订单信息小标题*/
.title2 {
  color: #333333;
  font-size: 18px;
  line-height: 90px;
}

.title3 {
  padding: 10px 0;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #c1c1c1;
}

/*详情1*/
.detail1 {
  border-top: 1px solid #e1e1e1;

  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 29px;
}
/*设置字体*/
.detail1 p {
  color: #999999;
  font-size: 18px;
  margin-top: 29px;
}
.detail1 span {
  display: inline-block;
  width: 170px;
}

/**/
.address-header,
.approve-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #eeeeee;
  display: flex;
  font-size: 16px;
  color: #999999;
}
.address-body,
.approve-body {
  width: 100%;
  line-height: 55px;
  display: flex;
  font-size: 16px;
  color: #333333;
}
._span1 {
  flex: 2;
  margin-left: 33px;
}
._span2 {
  flex: 4;
}
._span3 {
  flex: 4;
}
._span4 {
  flex: 2;
}
._span5 {
  flex: 2;
  margin-right: 37px;
}
/*物流费用*/
.express-pay {
  height: 65px;
  line-height: 65px;
  border-bottom: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;
  color: #999999;
  font-size: 18px;
}

/*表头*/
.table-header {
  height: 50px;
  width: 100%;
  background: #eeeeee;
  line-height: 50px;
  display: flex;
}
.span1,
.div1 {
  margin-left: 20px;
  flex: 4;
}
.span2,
.div2 {
  flex: 8;
}
.span3,
.div3 {
  flex: 13;
}
.span4,
.div4 {
  flex: 5;
}
.span5,
.div5 {
  flex: 7;
}
.span6,
.div6 {
  flex: 5;
}
.span7,
.div7 {
  flex: 5;
}
.span8,
.div8 {
  flex: 5;
}
.span9,
.span10,
.div10,
.div9 {
  flex: 9;
}
.div9 {
  a {
    color: #409eff;
  }
}

/*底部*/
.bottom1 {
  height: 50px;
  width: 100%;
  background: #eeeeee;
  line-height: 50px;
  display: flex;
}
.bottom1 p {
  margin-left: 33px;
  color: #666666;
  font-size: 14px;
}
// 金额明细
.money_detail {
  width: 100%;
  padding-right: 464px;
  border-bottom: 2px solid #e1e1e1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .money_item {
    margin-top: 29px;
    display: flex;
    .left {
    }
    .right {
      width: 100px;
      text-align: right;
    }
  }
  .money_item:last-child {
    margin-bottom: 29px;
  }
}

/*列表项*/
.item {
  padding-top: 18px;
  display: flex;
  width: 100%;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 15px;
  margin-bottom: 0px;
}
.item div {
  color: #666666;
  font-size: 14px;
}
.item div p {
  margin-bottom: 5px;
}
.beizhu {
  color: #999999;
}

.approve-list {
  display: flex;
  display: -webkit-flex;
  margin: 20px 0;
  flex-flow: column wrap;
  > div {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    > p {
      height: 30px;
      line-height: 30px;
      &:nth-of-type(1) {
        flex: 0 0 120px;
      }
      &:nth-of-type(2) {
        flex: 1;
      }
    }
  }
}
/**/
/**/
</style>
