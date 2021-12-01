<template>
  <div id="app">
    <!--引用子组件，并向其传值-->
    <trade-header @searchTrue="searchTrue" @searchFalse="searchFalse"></trade-header>
    <router-view></router-view>
    <trade-footer></trade-footer>
  </div>
</template>

<script>
//引入头和尾组件
import tradeHeader from "components/tradeHeader";
import tradeFooter from "components/tradeFooter";
export default {
  data() {
    return {
      showSearch: true,
      showNav: true
    };
  },
  mounted() {},
  methods: {
    searchTrue() {
      this.showSearch = true;
    },
    searchFalse() {
      this.showSearch = false;
    }
  },
  components: {
    //注册组件
    tradeHeader,
    tradeFooter
  }
};
</script>

<style lang='less' scoped>
html,
body {
  height: 100%;
  width: 100%;
  background-color: #f4f4f4;
  #app {
    width: 100%;
    height: 100%;
    /*增加背景颜色*/
    .header {
      margin: 0 auto;
      background-color: #f5f5f5;
    }
    .center {
      height: 650px;
    }
  }
}

</style>
