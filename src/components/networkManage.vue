<template>
  <div class="address1">
    <div class="address-wrap" v-for="item in networkList" :key="item.crmNetworkVo.id">
      <img :src="networkPicker==item.crmNetworkVo.id?pick:noPick" @click="choose(item)" alt />
      <div>
        <span>营业网点：</span>
        {{item.networkType}}
      </div>
      <div>
        <span>营业网点信息：</span>
        <span>{{item.crmNetworkVo.name}}</span>
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
  props: ["networkList", "networkPicker"],
  data() {
    return {
      addrActive,
      pick,
      noPick
    };
  },
  methods: {
    toCenterAddress() {
      this.$emit("saveOrderInfo");
      this.$router.push("/service/myaddress?type=order");
    },
    choose(item) {
      this.$emit("changeNetwork", item);
    }
  }
};
</script>

<style lang='less' scoped>
.address1 {
  display: -webkit-flex;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  > div {
    &:nth-last-of-type(1) {
      border: 0;
      button {
        margin-top: 130px;
        background-color: #fff;
        color: #0060ff;
      }
    }
  }
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

      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(3) {
        flex: 0 0 20%;
      }
      &:nth-last-of-type(1) {
        flex: 1;
      }
      &:nth-of-type(1) {
        margin-left: 30px;
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
