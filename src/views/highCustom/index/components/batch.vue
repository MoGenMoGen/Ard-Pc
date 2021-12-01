<template>
  <div class="batch">
    <div class="title">
      <span @click="toIndex">首页 ></span>
      <span @click="toHighCustomize">高端定制 ></span>
      <span>购物车</span>
    </div>

    <div class="cart-content">
      <div class="cart-info">全部意向订单</div>
      <div class="cart-table">
        <!-- 列名 -->
        <div class="table-title">
          <div>序号</div>
          <div>
            <img :src="selectAll?pick:notPick" alt @click="chooseAll" />
            全选
          </div>
          <div>意向订单名称</div>
          <div>意向订单编码</div>
          <div>操作</div>
        </div>
        <!-- 购物车内容 -->
        <div class="table-item" v-for="(item, index) in batchList" :key="index">
          <div>{{index+1}}</div>
          <div>
            <img :src="item.checked?pick:notPick" @click="changeStatus(item,index)" alt />
          </div>
          <div @click="toCartList(item.id)">{{item.remark}}</div>
          <div @click="toCartList(item.id)">{{item.catOrderCode}}</div>
          <div>
            <button @click="delCart(item)">删除</button>
            <button @click="modifyName(item)">修改</button>
            <button @click="exportExcel(item)">导出</button>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-footer">
      <div class="checked-all">
        <div>
          <img :src="selectAll?pick:notPick" @click="chooseAll" alt />
          全选
        </div>
        <div @click="delCart()">删除</div>
        <div @click="exportExcel()">导出</div>
        <div>
          <span>已选意向订单</span>
          <span>
            <i>{{selectLength}}</i>批
          </span>
        </div>
      </div>
      <div class="btn">
        <button @click="toOrder">提交订单</button>
      </div>
    </div>
    <div class="pageInfo">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5,10,20,50,100]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 查看意向订单里面的购物车 -->
    <el-dialog
      width="90%"
      title="查看购物车"
      :visible.sync="cartDialogShow"
      :close-on-click-modal="false"
      @close="closeCartDialog"
      append-to-body
    >
      <cart-list :catCartId="catCartId"></cart-list>
    </el-dialog>
    <!-- 修改购物车意向订单备注 -->
    <modify-batch
      :cartBatchVisible="cartBatchVisible"
      :id="batchId"
      @changeBatchDialog="getDialogShow"
      @pickBatchCertain="pickBatchCertain"
    ></modify-batch>
  </div>
</template>

<script type="text/ecmascript-6">
import notPick from "../images/not-pick.png";
import pick from "../images/pick.png";
import CartList from "./CartList";
import ModifyBatch from "@/components/ModifyBatch";
export default {
  data() {
    return {
      notPick,
      pick,
      selectAll: false,
      param: {
        pageSize: "",
        pageNum: "",
        buyId: ""
      },
      pageSize: 5,
      pageNum: 1,
      batchId: 0,
      batchList: [],
      catCartId: 0,
      cartDialogShow: false,
      cartBatchVisible: false,
      batchRemark: "",
      total: 0
    };
  },
  computed: {
    selectLength() {
      let selectBatchList = this.batchList.filter(item => item.checked);
      return selectBatchList.length;
    }
  },
  mounted() {
    this.getBatchList();
  },
  methods: {
    closeCartDialog() {
      this.getBatchList();
    },
    getDialogShow(val) {
      this.cartBatchVisible = val;
    },
    pickBatchCertain(remark) {
      //修改备注确定
      const param = {
        id: this.batchId,
        remark
      };

      this.api.postMoidfyBatchCart(param).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.cartBatchVisible = false;
          this.getBatchList();
        }
      });
    },
    async getBatchList() {
      let userInfo = this.until.loGet("userInfo");
      if (userInfo) {
        const qry = new this.Query();
        qry.buildPageClause(this.pageNum, this.pageSize);
        qry.buildOrderClause("crtTm", "desc");

        const param = qry.getParam();
        let res = await this.api.getCartBatchListByPage(param);
        const { records, total } = { ...res.data };
        this.batchList = records.map(item => item.crmCartCatVo);
        this.total = total;
        this.store.commit("setCartNum", total);
      } else {
        this.$message.error("您还没有登录系统，无法使用购物车功能，请先登录！");
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 2000);
      }
    },
    delCart(item) {
      let idArr = [];
      if (item) {
        idArr.push(item.id);
      } else {
        this.batchList.forEach(item => {
          if (item.checked) {
            idArr.push(item.id);
          }
        });
      }
      this.api.sysDelCartBatch({ ids: idArr.join(",") }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          const cartArr = this.batchList.filter(cart => cart != item);
          const qry = new this.Query();
          qry.buildPageClause(1, 10);

          const param = qry.getParam();
          this.api.getCartBatchListByPage(param).then(r => {
            if (r.code == 0) {
              this.store.commit("setCartNum", r.data.total);
            }
          });
          //重新调用意向订单接口
          this.getBatchList();
          this.calCheckAll();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    exportExcel(item) {
      //导出多个
      const idArr = [];
      if (item) {
        idArr.push(item.id);
      } else {
        this.batchList.forEach(item => {
          if (item.checked) {
            idArr.push(item.id);
          }
        });
      }

      const idStr = idArr.join(",");

      window.open(`/crm/cartInfo/exptByCatIds?catIds=${idStr}`);
    },
    toOrder() {
      if(this.selectLength==0) {
        this.$message.error("您还没有选择意向订单！");
        return;
      }
      //得到选择的意向订单数据，传到订单
      const ids = [];
      this.batchList.forEach(item => {
        if (item.checked) {
          ids.push(item.id);
        }
      });
      this.$router.push({
        path: "./order",
        query: { ids: ids.join(",") }
      });
    },
    chooseAll() {
      this.selectAll = !this.selectAll;
      this.batchList.map((item, index) => {
        item.checked = this.selectAll;
        this.$set(this.batchList, index, item);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getBatchList();
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.getBatchList();
    },
    toIndex() {
      this.$router.push("/");
    },
    toHighCustomize() {
      this.$router.push("./customize");
    },
    changeStatus(item, index) {
      let filter = this.batchList.filter(itemBatch => itemBatch == item);
      filter[0].checked = !filter[0].checked;
      this.$set(this.batchList, index, item);
      this.calCheckAll();
    },
    calCheckAll() {
      let remainArr = this.batchList.filter(item => !item.checked);
      if (remainArr.length > 0) {
        this.selectAll = false;
      } else {
        this.selectAll = true;
      }
    },
    toCartList(id) {
      this.catCartId = id;
      this.cartDialogShow = true;
    },

    modifyName(item) {
      this.cartBatchVisible = true;
      this.batchId = item.id;
      this.batchRemark = item.remark;
    }
  },
  components: {
    CartList,
    ModifyBatch
  }
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
.batch {
  width: 100%;
  background-color: #f5f5f5;
  .title {
    width: 1200px;
    margin: 0px auto;
    padding: 20px 0;
    span {
      &:not(:nth-last-of-type(1)) {
        cursor: pointer;
      }
    }
  }
  .cart-content {
    box-sizing: border-box;
    background-color: #fff;
    width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    .cart-info {
      padding: 20px 0;
      font-size: 18px;
      border-bottom: 1px solid #e1e1e1;
    }
    .cart-table {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        > div {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          flex: 1;
          &:nth-of-type(3),
          &:nth-last-of-type(1) {
            flex: 2;
          }
          &:nth-of-type(4) {
            flex: 4;
          }
          &:nth-of-type(2) {
            img {
              margin-right: 15px;
            }
          }
          &:nth-last-of-type(1) {
            button {
              padding: 5px 10px;
              background-color: @btnColor;
              color: #fff;
              cursor: pointer;
              &:not(:nth-of-type(1)) {
                margin-left: 20px;
              }
            }
          }
        }
        &:not(:nth-of-type(1)) {
          padding: 20px 0;
          > div {
            &:nth-of-type(3) {
              color: blue;
              cursor: pointer;
            }
          }
        }
        &:not(:nth-last-of-type(1)) {
          border-bottom: 1px solid #e1e1e1;
        }
      }
    }
  }
  .cart-footer {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    width: 1200px;
    margin: 20px auto;
    background-color: #fff;
    > div {
      padding: 15px 0;
    }
    .checked-all {
      flex: 1;
      margin-left: 12.4%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      > div {
        flex: 0 0 auto;
        margin-right: 40px;
        &:nth-of-type(1) {
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          align-items: center;
          img {
            margin-right: 15px;
          }
        }
        &:nth-of-type(2),
        &:nth-of-type(3) {
          cursor: pointer;
        }
        i {
          font-style: normal;
          color: #ff9801;
        }
      }
    }
    .btn {
      flex: 0 0 auto;
      width: 10%;
      background-color: #ff9801;
      button {
        width: 100%;
        height: 100%;
        background-color: #ff9801;
        color: #fff;
      }
    }
  }
  .pageInfo {
    width: 1200px;
    padding: 20px 0;
    margin: 0px auto;
  }
}
</style>
