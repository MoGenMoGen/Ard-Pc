<template>
  <div id="center">
    <div class="nav1">
      <router-link class="router" to="/service/personal">个人中心</router-link>
      <router-link class="router" to="/service/order">我的订单</router-link>
      <router-link class="router" to="/service/myaddress">收货地址</router-link>
      <router-link class="router" to="/service/mynetwork">营业网点</router-link>
      <router-link class="router" to="/service/message">我的消息</router-link>
      <router-link class="router" to="/service/feedback">意见反馈</router-link>
      <router-link class="router" to="/service/changepass"
        >修改密码</router-link
      >
      <router-link v-if="showAgent" class="router" to="/service/distributor"
        >我的经销商</router-link
      >
      <router-link v-if="isDealer" class="router" to="/service/saleoutlet"
        >销售网点</router-link
      >
      <router-link class="router" to="/service/paydetail">付款详情</router-link>
      <router-link v-if="isDealer" class="router" to="/service/integral"
        >我的积分</router-link
      >
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      showAgent: true,
      isDealer: false, //是否经销商
    };
  },
  mounted() {
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      if (
        this.userInfo.saleType === 1 ||
        this.userInfo.saleType === 3 ||
        this.userInfo.saleType === 4
      ) {
        this.showAgent = false;
      }
      if (this.userInfo.userType == 2) this.isDealer = true;
    }
  },
  methods: {},
  components: {},
};
</script>

<style lang='less' scoped>
.nav1 {
  float: left;
  display: table;
  min-width: 105px;
  background: white;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 46px;
  padding-right: 46px;
  margin-right: 30px;
  font-size: 16px;
  /*router-link 标签 在选中的时候 会自动给整个标签添加一个 router-link-active的class
  你可以根据这个class 设置他的样式。 如果再选中 其他的。 这个class 就会消失 。*/
  .router-link-active {
    width: 100%;
    text-decoration: none;
    color: #fff;
    background-color: #ff9801;
    border-radius: 4px;
  }
}

.router {
  display: block;
  white-space: nowrap;
  margin: 12px auto;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  color: #666666;
  font-size: 16px;
}

#center {
  display: flex;
  width: 1200px;
  padding: 40px 0;
  margin: 0 auto;
}
</style>
