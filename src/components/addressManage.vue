<template>
  <div class="address1">
    <div class="linkMan">
      <el-input type="text" placeholder="收货人姓名" v-model="filtValue.name"  width="50px"></el-input>
      <el-input type="text" placeholder="收货人联系电话" v-model="filtValue.tel"  width="50px"></el-input>
      <el-button @click="chFilter">查询</el-button>
    </div>

    <div class="address-wrap" v-for="item in addressList" :key="item.id">
      <img :src="addrPk==item.id?pick:noPick" @click="choose(item)" alt />
      <div>
        <span>地址类型：</span>
        {{item.addressType}}
      </div>
      <div>
        <span>收货人：</span>
        {{item.linkMan}}
      </div>
      <div>
        <span>联系电话：</span>
        {{item.linkPhone}}
      </div>
      <div>
        <span>详细地址：</span>
        <span>{{item.areaName}}{{item.address}}</span>
      </div>
      <!-- <img :src="addrActive" v-if="addrPk==item.id" /> -->
    </div>
    <!-- <div class="address-wrap">
      <button @click="toCenterAddress">管理收货地址</button>
    </div> -->
  </div>
</template>

<script>
import addrActive from "./images/选中.png";
import pick from "./images/pick.png";
import noPick from "./images/no-pick.png";
export default {
  props: ["addressList", "addrPk"],
  data() {
    return {
      filtValue:{
        name:'',
        tel:''
      },
      addrActive,
      pick,
      noPick
    };
  },
  methods: {
    chFilter () {
      this.$emit("chFilter", this.filtValue);
    },
    toCenterAddress() {
      this.$emit("saveOrderInfo");
      this.$router.push("/service/myaddress?type=order");
    },
    choose(item) {
      this.$emit("changeAddr", item);
    }
  }
};
</script>

<style lang='less'>
.address1 {
  display: -webkit-flex;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  .linkMan{
    .el-input{
      display: inline-block;
      width: 200px;
    }
  }
  /*> div {*/
    /*&:nth-last-of-type(1) {*/
      /*border: 0;*/
      /*button {*/
        /*margin-top: 130px;*/
        /*background-color: #fff;*/
        /*color: #0060ff;*/
      /*}*/
    /*}*/
  /*}*/
  .address-wrap {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100%;
    position: relative;
    img {
      width: 20px;
      height: 20px;
    }
    > div {
      color: #666666;
      margin: 4px 0;
      line-height: 26px;
      /*overflow: hidden;*/
      display: flex;
      display: -webkit-flex;

      &:nth-of-type(1){
        flex: 0 0 15%;
        margin-left: 10px;
      }

      &:nth-of-type(3) {
        flex: 0 0 20%;
      }
      &:nth-of-type(2){
        flex: 0 0 12%;
      }
      &:nth-last-of-type(1) {
        flex: 1;
      }
      span {
        /*display: block;*/
        /*float: left;*/
        /*width: auto;*/
        &:nth-child(2) {
          flex: 1;
        }
      }
    }
  }
  .active {
    border-color: #0d55d2;
  }
}
</style>
