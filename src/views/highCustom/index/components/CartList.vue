<template>
  <div class="cart">
    <div class="cart-content">
      <div class="cart-info">全部商品</div>
      <div class="cart-table">
        <!-- 列名 -->
        <div class="table-title">
          <div>序号</div>
          <div>
            <img :src="selectAll?pick:notPick" alt @click="chooseAll" />
            全选
          </div>
          <div>产品名称</div>
          <div>定制属性规格</div>
          <div>定制类型</div>
          <div>安装位置备注</div>
          <div>备注</div>
          <div>备注（其它产品信息）</div>
          <div>数量</div>
          <!-- <div>备注（安装位置）</div>
          <div>备注（其它）</div>-->
          <div>操作</div>
        </div>
        <!-- 购物车内容 -->
        <div class="table-item" v-for="(item, index) in cartList" :key="index">
          <div>{{index+1}}</div>
          <div>
            <img :src="item.checked?pick:notPick" @click="changeStatus(item,index)" alt />
          </div>
          <div>{{item.productName+(item.specName===null?"":("/"+item.specName))}}</div>
          <div>{{item.productAttr}}</div>
          <div v-if="item.productType===1">定制</div>
          <div v-else-if="item.productType===2">艺术定制</div>
          <div v-else-if="item.productType===3">专属定制</div>
          <div v-else-if="item.productType===0">标准</div>
          <div v-else></div>
          <div>
            <textarea placeholder="请输入备注（安装位置）" v-model="item.installSite" @click="setCartinfoId(item)" @change="changeInstallSite(item.installSite)"></textarea>
          </div>
          <div>
            <textarea placeholder="请输入备注（其它）" v-model="item.remark" @click="setCartinfoId(item)"@change="changeRemark(item.remark)"></textarea>
          </div>
          <div>
            <textarea placeholder="请输入备注（其它产品信息）" v-model="item.remarkProduct" @click="setCartinfoId(item)"@change="changeRemarkProduct(item.remarkProduct)"></textarea>
          </div>
          <div>
            <span @click="minus(item)">-</span>
            <span>{{item.buyNum}}</span>
            <span @click="plus(item)">+</span>
          </div>
          <!-- <div>
            <textarea placeholder="请输入备注（安装位置）" v-model="item.installSite"></textarea>
          </div>
          <div>
            <textarea placeholder="请输入备注（其它）" v-model="item.remark"></textarea>
          </div>-->
          <div>
            <button @click="delCart(item)">删除</button>
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
        <!-- <div>
          <span>已选商品</span>
          <span>
            <i>{{selectLength}}</i>件
          </span>
        </div>-->
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
  </div>
</template>

<script>
import notPick from "../images/not-pick.png";
import pick from "../images/pick.png";
export default {
  props: {
    catCartId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      changeId:"",
      notPick,
      cartList: [],
      pick,
      selectAll: false,
      param: {
        pageSize: "",
        pageNum: "",
        buyId: ""
      },
      pageSize: 5,
      pageNum: 1,
      total: 0
    };
  },
  watch: {
    catCartId(val) {
      this.getCartList();
    }
  },
  computed: {
    selectLength() {
      let selectCartList = this.cartList.filter(item => item.checked);
      return selectCartList.length;
    }
  },
  mounted() {
    this.getCartList();
  },
  methods: {
    minus(item) {
      if (item.buyNum > 1) {
        item.buyNum -= 1;
        const param = {
          id: item.id,
          buyNum: item.buyNum
        };
        this.api.editCartNum(param);
      }
    },
    setCartinfoId(item){
      this.changeId = item.id;
    },
    changeRemarkProduct(value){
      var form={};
      form.id =this.changeId;
      form.remarkProduct = value
      this.until.post("/crm/cart/api/updRemarkProduct",form).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "购物车备注(其他产品信息)修改成功",
            type: "success"
          });
        }
      });
    },
    changeRemark(value){
      var form={};
      form.id =this.changeId;
      form.remark = value
      this.until.post("/crm/cart/api/updRemark",form).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "购物车备注修改成功",
            type: "success"
          });
        }
      });
    },
    changeInstallSite(value){
      var form={};
      form.id =this.changeId;
      form.installSite = value
      this.until.post("/crm/cart/api/updInstallSite",form).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "安装位置修改成功",
            type: "success"
          });
        }
      });
    },
    plus(item) {
      item.buyNum += 1;
      //调用后端接口
      const param = {
        id: item.id,
        buyNum: item.buyNum
      };
      this.api.editCartNum(param);
    },
    toIndex() {
      this.$router.push("/");
    },
    toHighCustomize() {
      this.$router.push("./customize");
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.getCartList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getCartList();
    },
    chooseAll() {
      this.selectAll = !this.selectAll;
      this.cartList.map((item, index) => {
        item.checked = this.selectAll;
        this.$set(this.cartList, index, item);
      });
    },
    changeStatus(item, index) {
      let filter = this.cartList.filter(itemCart => itemCart == item);
      filter[0].checked = !filter[0].checked;
      this.$set(this.cartList, index, item);
      this.calCheckAll();
    },
    calCheckAll() {
      let remainArr = this.cartList.filter(item => !item.checked);
      if (remainArr.length > 0) {
        this.selectAll = false;
      } else {
        this.selectAll = true;
      }
    },
    toOrder() {
      //购物车数据
      let selectCartList = this.cartList.filter(item => item.checked);
      if (selectCartList.length === 0) {
        this.$message.error("请选择至少一样商品！");
      } else {
        selectCartList.forEach(item => {
          item.orderNum = item.buyNum;
        });
        this.until.loSave("cartList", JSON.stringify(selectCartList));
        this.$router.push({
          path: "./order"
        });
      }
    },
    async getCartList() {
      let userInfo = this.until.loGet("userInfo");
      if (userInfo) {
        let userObj = JSON.parse(userInfo);
        this.param = {
          buyId: userObj.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          cartCatId: this.catCartId
        };

        let res = await this.api.getSysCartList(this.param);
        this.cartList = res.data.result;
        this.total = res.data.total;
        this.cartList.map(item => {
          let arr = [];
          item.productAttributes &&
            item.productAttributes.map(itemChild => {
              arr.push(itemChild.attributeValueName);
            });
          item.productAttr = arr.join(" ");
        });
      }
    },
    delCart(item) {
      let idArr = [];
      if (item) {
        idArr.push(item.id);
      } else {
        this.cartList.forEach(item => {
          if (item.checked) {
            idArr.push(item.id);
          }
        });
      }
      this.api.sysDelCart({ ids: idArr.join(",") }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getCartList();
          // const cartArr = this.cartList.filter(cart => cart != item);
          //重新调用购物车，不然上面的写法会导致如果是多页，删除了之后，第一页是显示4条了

          this.calCheckAll();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.cart {
  width: 100%;
  background-color: #f5f5f5;
  .title {
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
          &:nth-of-type(1),
          &:nth-last-of-type(1) {/*序号*/
            width: 5%;
          }
          &:nth-of-type(7){ /*数量*/
            width: 10%;
          }
          &:nth-of-type(9) { /*数量*/
            width: 6%;
          }
          &:nth-of-type(2) {
            width: 6%;
          }
          &:nth-of-type(6) {
            width:10%;
          }
          &:nth-of-type(8) {
            width:10%;
          }

          &:nth-of-type(3)
          {
            width: 12%;
          }
          &:nth-of-type(4) {
            width: 13%;
          }

          &:nth-of-type(2) {
            img {
              margin-right: 10px;
            }
          }
        }
        &:nth-of-type(1) {
          > div {
            &:nth-last-of-type(2) {
              justify-content: center;
            }
          }
        }
        &:not(:nth-of-type(1)) {
          padding: 20px 0;
          > div {
            &:nth-last-of-type(2) {
              > span {
                flex: 1;
                border: 1px solid #ccc;
                background-color: #ccc;
                padding: 10px 0;
                text-align: center;
                cursor: pointer;
                &:nth-of-type(2) {
                  flex: 2;
                  background-color: #fff;
                  cursor: text;
                }
              }
            }
            &:nth-last-of-type(1) {
              button {
                background-color: #fff;
                color: #999;
              }
            }
            textarea {
              height: 100px;
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
    margin: 20px auto;
    background-color: #fff;
    > div {
      padding: 15px 0;
    }
    .checked-all {
      flex: 1;
      margin-left: 9.1%;
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
        &:nth-of-type(2) {
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
