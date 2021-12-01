<template>
  <div class="shop">
    <!--<div class="cart">-->
    <!--<span>{{cartNum}}</span>-->
    <!--<i class="el-icon-shopping-cart-2"></i>-->
    <!--</div>-->
    <div class="main">
      <div class="pos">
        <a href="../home/index.html">首页</a> >
        <a href="../home/index.html#/shop">ILI商城</a> >
        <span>商品详情</span>
      </div>
      <div class="info">
        <div class="img">
          <div class="bigImg">
            <img :src="currentImg" />
          </div>
          <div class="imgList">
            <i class="el-icon-arrow-left" @click="toPre"></i>
            <div>
              <p>
                <img :src="item" v-for="item in imgList" :key="item" @click="currentImg=item" />
              </p>
            </div>
            <i class="el-icon-arrow-right" @click="toNext"></i>
          </div>
        </div>
        <div class="infoMation">
          <p>{{info.name}}</p>
          <div class="spec">
            <p>规格：</p>
            <span class="active">{{info.specName}}</span>
          </div>
          <div>装箱数/箱：{{info.packNum}}</div>
          <div class="chooseNum">
            数量：
            <input type="number" v-model="currentNum" />
            <p>
              <img :src="add" @click="currentNum++" />
              <img :src="reduce" @click="numReduce" />
            </p>
            {{info.packUnit}}
          </div>
          <!-- <div>单价：{{info.price.toFixed(2)}} 元</div> -->
          <div class="btn">

            <button @click="toPay">立即下单</button>
            <button @click="addCart">加入购物车</button>
          </div>
          <div class="first-upload">
            <span>附件:</span>
            <el-upload
              class="upload-demo"
              action="string"
              :http-request="uploadImg"
              :multiple="true"
              :before-remove="beforeRemove"
              :limit="5"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handlePictureCardRemove"
              accept=".dwg, .jpg, .jpeg, .png, .pdf, .bmp"
            >
              <el-button size="medium" type="warning">点击上传</el-button>
            </el-upload>
            <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="auto" height="auto" :src="dialogImageUrl" alt />
            </el-dialog>-->
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="title">
          <p>商品详情</p>
        </div>
        <div v-html="info.detail"></div>
      </div>
    </div>
    <!-- 加入购物车的时候选择批次 -->
    <pick-batch
      :cartBatchVisible="cartBatchVisible"
      @changeBatchDialog="getDialogShow"
      @pickBatchCertain="pickBatchCertain"
    ></pick-batch>
  </div>
</template>

<script>
import add from "../images/add.png";
import reduce from "../images/reduce.png";
import ilikelog from "../images/ilikelog.png";
import PickBatch from "@/components/PickBatch";
export default {
  data() {
    return {
      ilikelog,
      cartNum: 0,
      add,
      reduce,
      fileList:[],
      info: {},
      currentNum: 1,
      currentImg: "",
      currentSpec: "",
      imgListShow: [],
      imgList: [],
      cartBatchVisible: false,
      specList: [
        {
          cd: 1,
          nm: "2020212SN"
        },
        {
          cd: 2,
          nm: "2020212S2"
        },
        {
          cd: 3,
          nm: "2020212S3"
        }
      ]
    };
  },
  mounted() {
    if (!this.until.loGet("userInfo")) {
      this.$confirm("您还没有登录，立即登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再看看",
        type: "warning"
      })
        .then(() => {
          this.until.href("../home/login.html");
        })
        .catch(() => {
          this.until.href("../home/index.html");
        });
      return;
    }
    this.id = this.$route.query.id;
    this.getInfo();
  },
  methods: {
    async uploadImg(item) {
      //自定义上传图片事件
      const url = await this.api.postSendPicToService(item);
      // this.product.shapeImgUrl = this.product.shapeImgUrl
      //   ? `${this.product.shapeImgUrl},${url}`
      //   : url;
      // this.product.shapeRemark = this.product.shapeRemark
      //   ? `${this.product.shapeRemark},${item.name}`
      //   : item.name;
      this.fileList.push({
        name: item.file.name,
        url
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
      // this.dialogVisible = true;
    },
    handlePictureCardRemove(file, fileList) {
      this.fileList = fileList;
    },
    addCart() {
      this.cartBatchVisible = true;
    },
    getDialogShow(val) {
      this.cartBatchVisible = val;
    },
    pickBatchCertain(batch) {
      const { cartCatId, cartCatRemark } = { ...batch };
      let file = []
      this.fileList.forEach(item=>{
        file.push(item.url)
      });
      let strings = file.join(',');
      let param = {
        productSku: this.info.code, //产品编码

        productName: this.info.name, //产品名称

        buyId: JSON.parse(this.until.loGet("userInfo")).userId, //购买人编号

        buyName: JSON.parse(this.until.loGet("userInfo")).realName, //购买人名称

        buyNum: this.currentNum, //购买数量
        shapeImgUrl:strings,

        productAttributeCode: "", //选择的产品属性代码

        // productAttributes	T文本	是
        // 数据为json数据格式

        productImgUrl: this.info.imgMainUrl, //产品图片
        specId: this.info.specId, //规格编号
        specName: this.info.specName, //规格名称
        cartCatId,
        cartCatRemark
      };
      this.api.postSysAddCart(param).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "加入购物车成功",
            type: "success"
          });
          this.cartBatchVisible = false;
        }

        const qry = new this.Query();
        qry.buildPageClause(1, 10);

        const param = qry.getParam();
        this.api.getCartBatchListByPage(param).then(r => {
          if (r.code == 0) {
            this.store.commit("setCartNum", r.data.total);
          }
        });
      });
    },
    toPay() {
      let data = [];
      data[0] = {};
      data[0].productSku = this.info.code;
      data[0].productImgUrl = this.info.imgMainUrl;
      data[0].buyNum = this.currentNum;
      data[0].productName = this.info.name;
      data[0].specName = this.info.specName;
      data[0].specId = this.info.specId;
      data[0].orderNum = this.currentNum;
      data[0].discount = this.info.discount;
      let file = []
      this.fileList.forEach(item=>{
        file.push(item.url)
      })
      data[0].shapeImgUrl = file.join(',');
      // data[0].productPrice=this.info.price
      data[0].remark = "";
      this.until.loSave("cartList", JSON.stringify(data));
      this.$router.push("order");
    },
    async getInfo() {
      let data = await this.api.getProInfo(this.id);
      this.info = data.crmStandardProductVo;

      if (this.info.imgUrl && this.info.imgUrl !== "null") {
        this.imgList = this.info.imgUrl.split(",");
        this.currentImg = this.imgList[0];
      } else {
        this.imgList.push(this.ilikelog);
        this.currentImg = this.ilikelog;
      }
      this.currentSpec = this.specList[0].cd;
    },
    toPre() {
      this.imgList.unshift(this.imgList.pop());
    },
    toNext() {
      this.imgList.push(this.imgList.shift());
    },
    numReduce() {
      if (this.currentNum > 1) {
        this.currentNum--;
      }
    }
  },
  components: {
    PickBatch
  }
};
</script>

<style lang='less' scoped>
.shop {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  .first-upload{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    >span{
      padding-right: 10px;
    }
  }
  .cart {
    width: 70px;
    height: 70px;
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid #e4e4e4;
    position: fixed;
    z-index: 999;
    right: 100px;
    top: 100px;
    span {
      position: absolute;
      top: 5px;
      right: 5px;
      background: #ff4d51;
      color: #ffffff;
      padding: 2px 5px;
      border-radius: 5px;
    }
    i {
      margin-top: 10px;
      margin-left: 10px;
      font-size: 50px;
      color: #666666;
    }
  }
  .main {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    .pos {
      width: 100%;
      font-size: 16px;
      color: #999999;
      padding: 15px 0;
      span {
        color: #333333;
      }
    }
    .info {
      width: 100%;
      overflow: hidden;
      display: flex;
      display: -webkit-flex;
      .img {
        width: 420px;
        margin-right: 30px;
        .bigImg {
          width: 420px;
          height: 420px;
          margin-bottom: 20px;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          justify-content: center;
          img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
        .imgList {
          display: flex;
          display: -webkit-flex;
          align-items: center;
          i {
            font-size: 20px;
            cursor: pointer;
          }
          > div {
            flex: 1;
            padding: 0 10px;
            overflow: hidden;
            p {
              width: 1000%;
            }
          }
          img {
            float: left;
            width: 90px;
            height: 90px;
            margin-right: 20px;
            cursor: pointer;
          }
          img:last-of-type {
            margin-right: 0;
          }
        }
      }
      .infoMation {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        > p {
          font-size: 24px;
          color: #3c3c3c;
          line-height: 80px;
        }
        > div {
          width: 100%;
          border-top: 1px solid #dfdfdf;
          padding: 30px 0;
        }
        .spec {
          p {
            color: #999999;
            display: inline-block;
          }
          span {
            display: inline-block;
            border: 1px solid #dfdfdf;
            box-sizing: border-box;
            height: 50px;
            line-height: 50px;
            padding: 0 8px;
            color: #999999;
            font-size: 16px;
            margin-right: 20px;
            cursor: pointer;
          }
          span.active {
            border: 0;
            background: #ff9801;
            color: #ffffff;
          }
        }
        .chooseNum {
          display: flex;
          display: -webkit-flex;
          align-items: center;
          input {
            border: 1px solid #dfdfdf;
            height: 42px;
            line-height: 42px;
            width: 131px;
            text-indent: 10px;
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
          p {
            display: inline-block;
            width: 40px;
            line-height: 0;
            margin-right: 10px;
            img {
              cursor: pointer;
              width: 40px;
              height: 24px;
              margin: 0;
            }
          }
        }
        .btn {
          border-top: 0;
          padding: 0;
          button {
            width: 218px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 5px;
            box-sizing: border-box;
            &:first-of-type {
              border: 1px solid #f6a33e;
              color: #f6a33e;
              background: #ffffff;
              margin-right: 20px;
            }
            &:last-of-type {
              background: #f6a33e;
              color: #ffffff;
            }
          }
        }
      }
    }
    .detail {
      padding-top: 80px;
      padding-bottom: 80px;
      width: 100%;
      .title {
        border-bottom: 1px solid #dfdfdf;
        p {
          width: 140px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          background: #ff9801;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
