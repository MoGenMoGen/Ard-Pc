<template>
  <div id="app">
    <trade-header2></trade-header2>
    <router-view></router-view>
    <div class="footer-wrap">
      <div>
        <span>版权所有@宁波埃瑞德智能家居有限公司</span>
      </div>
      <div>
        <span>技术支持：宁波聚联科技有限公司</span>
      </div>
    </div>
  </div>
</template>

<script>
//引入头和尾组件
import tradeHeader2 from "components/tradeHeader2";
export default {
  data() {
    return {};
  },
  methods: {},
  components: {
    //注册组件
    tradeHeader2
  }
};
</script>

<style lang='less' scoped>
html,
body {
  height: 100%;
  width: 100%;
  background-color: #f4f4f4 !important;
  #app {
    width: 100%;
    height: 100%;
    .header {
      margin: 0 auto;
      background-color: #fff;
    }
  
    .footer-wrap {
      position: fixed;
      left: 0;
      bottom: 0;
      padding: 20px 0;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      justify-content: space-around;
      color: #fff;
      align-items: center;
      background-color: #303030;
      > div {
        width: 100%;
        text-align: center;
        &:not(:nth-last-of-type(1)) {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
