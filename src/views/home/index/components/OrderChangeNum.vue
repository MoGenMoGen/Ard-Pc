<template>
  <div class="order-list" v-loading="loading">
    <div class="title">
      <span>订单编号：{{info?info.orderCode:''}}</span>
      <button class="button2" @click.stop="editOrderVisible1=true" v-if="info.chageStatus===0">确认提交</button>
      <button class="button3" @click.stop="changeOrder(0)" v-if="info.chageStatus===2">取消变更</button>
      <button class="button2" @click.stop="changeOrder(3)" v-if="info.chageStatus===2">确认变更</button>
    </div>
    <div class="table-header">
      <span class="span1">序号</span>
      <span class="span2">产品名称</span>
      <span class="span3">定制属性</span>
      <span class="span5">定制类型</span>
      <span class="span6">单价(元)</span>
      <span class="span11">激光切割费单价</span>
      <span class="span8">其他费用</span>
      <span class="span7">数量</span>
      <span class="span8">金额(元)</span>
      <span class="span10">订单状态</span>

    </div>
    <div class="list" v-if="info">
      <ul>
        <li v-for="(item,index) in info.orderItemList" :key="item.id" class="item">
          <div class="div1">{{index+1}}</div>
          <div class="div2">{{item.productName}}</div>
          <div class="div3">
            <p
              v-for="(v,i) in item.productAttributeList"
              :key="i"

            >{{v.attributeKeyName}}：{{v.attributeValueName}}</p>
          </div>

          <div class="div5" v-if="item.productType===1">定制</div>
          <div class="div5" v-else-if="item.productType===2">艺术定制</div>
          <div class="div5" v-else-if="item.productType===3">专属定制</div>
          <div class="div5" v-else-if="item.productType===0">标准</div>
          <div class="div5" v-else>标准</div>

          <div class="div6" v-if="!notShowTotal">
            <p v-if="info.chageStatus!==0">
              ￥{{item.productPrice}}(前)<br/>
              ￥{{item.chageProductPrice}}(后)
            </p>
            <p v-else>￥{{item.productPrice}}</p>

          </div>
          <div class="div6" v-else></div>
          <div class="div11" v-if="!notShowTotal">
            <p v-if="info.chageStatus!==0">
              ￥{{item.cutPrice}}(前)<br/>
              ￥{{item.chageCutPrice}}(后)
            </p>
            <p v-else>￥{{item.cutPrice}}</p>
          </div>
          <div class="div11" v-else></div>
          <div class="div8" v-if="!notShowTotal">
            <p v-if="info.chageStatus!==0">
              ￥{{item.extPrice}}(前)<br/>
              ￥{{item.chageExtPrice}}(后)
            </p>
            <p v-else>￥{{item.extPrice}}</p>
          </div>
          <div class="div8" v-else></div>
          <div class="div7" v-if="info.chageStatus===0">
            <input type="number" min="0" v-model="item.orderNum"/>
          </div>
          <div class="div7" v-if="info.chageStatus!==0">
            <p v-if="info.chageStatus!==0">
              {{item.orderNum}}(前)<br/>
              {{item.chageOrderNum}}(后)
            </p>
            <p v-else>{{item.orderNum}}</p>
          </div>
          <div class="div8" v-if="!notShowTotal">
            <p v-if="info.chageStatus!==0">
              ￥{{item.productAmount}}(前)<br/>
              ￥{{item.changeProductAmount}}(后)
            </p>
            <p v-else>￥{{item.productAmount}}</p>

          </div>
          <div class="div8" v-else></div>
          <div class="div10" v-if="item.status===-2">审核不通过</div>
          <div class="div10" v-if="item.status===-1">取消</div>
          <div class="div10" v-if="item.status===0">待审核</div>
          <div class="div10" v-if="item.status===5">已同步MES</div>
          <div class="div10" v-if="item.status===10">下料中</div>
          <div class="div10" v-if="item.status===20">订单组装中</div>
          <div class="div10" v-if="item.status===30">订单喷漆中</div>
          <div class="div10" v-if="item.status===40">订单包装中</div>
          <div class="div10" v-if="item.status===50">订货已发货</div>
          <div class="div10" v-if="item.status===60">技术评审</div>
          <div class="div10" v-if="item.status===70">客服评审</div>
          <div class="div10" v-if="item.status===80">生管评审</div>
          <div class="div10" v-if="item.status===90">待同步erp</div>
          <div class="div10" v-if="item.status===99">完成</div>
          <!--列表项中的操作-->

        </li>
      </ul>
      <div class="bottom1">
        <span class="span1">合计：</span>
        <span class="span2"></span>
        <span class="span3"></span>
        <span class="span5"></span>
        <span class="span6"></span>
        <span class="span11"></span>
        <span class="span8"></span>
        <span class="span7" v-if="info.chageStatus===0">{{totalNum}}</span>
        <span class="span7" v-if="info.chageStatus!==0">{{totalNum}}(前)</span>
        <span class="span7" v-if="info.chageStatus!==0">{{changeTotalNum}}(后)</span>
        <span v-if="!notShowTotal && info.chageStatus===0" class="span8">￥{{info.totalAmount}}</span>
        <span v-if="!notShowTotal && info.chageStatus!==0" class="span8">￥{{info.totalAmount}}(前)</span>
        <!--<span v-if="!notShowTotal && info.chageStatus!==0" class="span8" >￥{{changeOrderAmount}}(后)</span>-->
        <span v-else class="span8"></span>
        <span class="span10"></span>
        <span class="span9"></span>
      </div>
    </div>

    <!-- 修改订单 step1 -->
    <el-dialog
      :title="repairType"
      :visible.sync="editOrderVisible1"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <span v-if="repairType==='修改订单'">请确认修改订单吗？修改订单会将状态重置为待审核并且重新审核</span>
      <span v-else>请确认变更订单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单 step2 -->

  </div>
</template>

<script>

export default {
  name: "orderlist",
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      loading:false,
      editRemarkForm:{},
      editRemark: false,
      currentNum: 1,
      id: "",
      detailInfo: {},
      totalAmount: 0,
      orderType: "5", //订单类型
      cancelOrderVisible: false,
      editOrderVisible1: false,
      editOrderVisible2: false,
      cancelItemId: "",
      editItemId: "",
      userInfo: {},
      num: 0,
      orderNum: 0,
      maxOrderNum: 0,
      stepArr: [],
      dialogShow: false,
      selectPro: {},
      form: {},
      idList: [],
      repairType: "修改订单",
      expressList: [],
      expressDialog: false,
      reverse: false,
      detailDialog: false,
      standardProDialog: false,
      customizeDialog: false,
      inputProNo: "",
      standardProList: [],
      writeProList: [],
      loading: false,
      showCaseImg: false,
      caseImgUrl: "",
      standPro: {},
      orderAddrVisible: false,
      dropdownList: [{ nm: "高端定制", id: 1 }, { nm: "标准产品", id: 2 }]
    };
  },
  computed: {
    productWidth() {
      let length = 0;
      this.stepArr.map(item => {
        length += item.children.length;
      });
      let width = 160 * length;
      return width > 912 ? width : "100%";
    },
    Random() {
      return Object.keys(this.form).length;
    },
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
    approveStatus() {
      return (
        this.info.status === -2 ||
        this.info.status === 0 ||
        this.info.status === 60 ||
        this.info.status === 70 ||
        this.info.status === 80
      );
    },
    totalNum() {
      if (this.info.orderItemList) {
        return this.info.orderItemList.reduce((p, n) => {
          return p + parseInt(n.orderNum);
        }, 0);
      }
    },
    changeTotalNum(){
      if (this.info.orderItemList && this.info.chageStatus!==0) {
        return this.info.orderItemList.reduce((p, n) => {
          return p + parseInt(n.chageOrderNum);
        }, 0);
      }
    },
    // changeOrderAmount(){
    //   if (this.info.orderItemList && this.info.chageStatus!==0) {
    //     return this.info.orderItemList.reduce((p, n) => {
    //       return p + parseInt(n.chageOrderNum)*parseFloat(n.chageProductPrice);
    //     }, 0);
    //   }
    // }
  },
  mounted() {
    console.log(this.info)
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }

  },
  methods: {
    //确定/取消订单变更
    changeOrder(type){
      this.loading = true
      let param = {
        crmOrderVo: {id:this.info.id},
        changeType:type,
      }
      this.api.changeOrder(JSON.stringify(param)).then(res=>{
        this.loading = false
        if (res.code === 0) {
          this.$message({
            message: "提交成功！",
            type: "success"
          });
          this.$emit("refresh", this.info);
          this.dialogShow = false;

        } else {
          this.$alert(res.msg, {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      })
    },
    //修改订单数量
    async confirmEditOrder() {
      this.editOrderVisible1 = false;
      let editList = [];
      this.info.orderItemList.forEach(item=>{
        editList.push({
          id: item.id,
          chageOrderNum: item.orderNum
        })
      })


      //修改订单传参
      let param = {
        crmOrderVo: {id:this.info.id},
        changeType:1,
        orderItemList: editList
      };
      let res = await this.api.sysChangeOrder(JSON.stringify(param));

      if (res.code === 0) {
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.$emit("refresh", this.info);
        this.dialogShow = false;

      }
    },

  },
  watch: {
    "info.orderItemList"(val) {
      val.map(item => {
        if (typeof item.productPrice === "number") {
          item.productAmount = item.productPrice * item.orderNum.toFixed(2);
          item.changeProductAmount = item.chageProductPrice * item.chageOrderNum.toFixed(2);
        }
      });
    },
    info(val) {
      val.delieryTime = val.delieryTime ? val.delieryTime.split(" ")[0] : "";
    }
  },
  components: {

  }
};
</script>

<style lang="less">
.el-dialog {
  min-height: 0;
  .span2 {
    margin-left: 0;
  }
}
</style>
<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*标题*/

.title {
  margin-left: 13px;
  color: #666666;
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 25px;
  display: flex;
  display: -webkit-flex;
  span{
    flex: 1;
    line-height: 55px;
  }
}
/*表头*/
.table-header {
  height: 50px;
  background: #eeeeee;
  line-height: 50px;
  display: flex;
}
.span1,
.div1 {
  margin-left: 13px;
  flex: 4;
}
.span2,
.div2 {
  flex: 6;
}
.span3,
.div3 {
  flex: 11;
}
.span4,
.div4 {
  flex: 5;
}
.span5,
.div5 {
  flex: 6;
}
.span6,
.div6 {
  flex: 5;
}
.span7,
.div7 {
  flex: 4;
  input{
    text-align: center;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e4e4e4;
  }

}
.span8,
.div8 {
  flex: 5;
}
.span9,
.div9 {
  flex: 7;
  text-align: center;
  margin-right: 10px;
}
.span10,
.div10 {
  flex: 5;
}

.span11,
.div11 {
  flex: 9;
}
/*底部*/
.bottom1 {
  height: 50px;
  width: 100%;
  line-height: 50px;
  display: flex;
}

/*列表项*/
.item {
  padding-top: 18px;
  display: flex;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 15px;
}
.item div {
  color: #666666;
  font-size: 14px;
}
.item div p {
  margin-bottom: 5px;
}
/*第一种类型的button*/
.button1 {
  border: 1px solid #f6a33e;
  color: #f6a33e;
  font-size: 14px;
  width: 96px;
  height: 29px;
  text-align: center;
  line-height: 29px;
  margin-top: 15px;
  cursor: pointer;
  background: white;
  border-radius: 3px;
}
.button1:hover {
  background: #f6a33e;
  color: white;
}
/*第2种类型的button*/
.button2,
.button3 {
  cursor: pointer;
  border: 1px solid #f6a33e;
  padding: 10px 20px;
  background-color: #f6a33e;
  color: #fff;
  font-size: 16px;
  margin-top: 15px;
  margin-left: 10px;
}

.button3 {
  color: #f6a33e;
  background-color: #fff;
}

.el-dialog {
  /*中间部分*/
  .center {
    margin-left: 33px;
  }
  .center p {
    margin-top: 31px;
    color: #666666;
    font-size: 18px;
  }
  /*底部*/
  .footer1 {
    margin-left: 33px;
    margin-top: 30px;
    .el-button--text {
      color: #17b3a3;
    }
  }
  .input-no {
    width: 60%;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    .order-label {
      width: 120px;
    }
    .el-select {
      flex: 1;
    }
  }
}
</style>
