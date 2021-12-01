<template>
  <div class="myHeader">
    <div class="header-wrap">
     <div id="top">

       <div class="log">
         <!--埃瑞德图标的链接-->
         <a href="../home/index.html">
           <img :src="tradeLog" alt />
         </a>
       </div>
     </div>
     </div>
  </div>
</template>

<script>
import tradeLog from "./images/ilike-log.png";
export default {
  props: {

  },
  data() {
    return {
        tradeLog,
    };
  },

  mounted() {},
  methods: {
    back() {
      window.history.go(-1);
    },

    toMember() {
      this.$emit("searchFalse");
      // this.$router.push({//你需要接受路由的参数再跳转
      //   path: '/center'
      // });
      window.location.href = "../home/login.html#/center";
    },
    choose(item, url) {
      this.$router.push({
        //你需要接受路由的参数再跳转
        path: url
      });
    }
  }
};
</script>

<style lang='less'>
  /*顶部最外层套一个标签*/
  #div_img{
    display: inline;
  }
  #top{
    /*弹性布局*/
    display: flex;
    /*设置元素不折行*/
    flex-wrap: nowrap;
    /*设置最小宽度，在屏幕缩小的时候看不到尾部*/
    min-width: 1200px;
    width: 100%;
    padding-top: 33px;
    padding-bottom: 33px;
    align-items:center;
  }
 .ic-saoma{

   cursor: pointer;
   margin-left: 8%;
   display: block;
 }
 .exit{
   cursor: pointer;
   margin-left: 5%;
   display: inline;
 }

 .ic-user{
   cursor: pointer;
   margin-left: 5%;
   display: inline;
 }
  .ic-bus{
    cursor: pointer;
    margin-left: 5%;
    display: inline;
  }
.ic-message{
  cursor: pointer;
  margin-left: 5%;
  display: inline;
}

.ic-phone{
  margin-left: 6%;
  display: inline;
}
.log{
  margin-left: 12.5%;
  display:inline;
}

  /*最外层头部布局，宽度占100%*/
.myHeader > p {
  width: 100%;
  max-width: 1200px;
  min-width: 1000px;
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  /*鼠标指针变成一个手*/
  cursor: pointer;
}
.header-wrap {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-bottom: 1px solid #f1f1f1;
  a {
    color: #666666;
  }


  .header-sidebar {
    width: 100%;
    min-width: 1200px;
    margin: 0 auto;
    background-color: #000;
    .sidebar {
      margin-left: 20%;
      width: 60%;
      display: -webkit-flex;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      > div {
        flex: 1;
        margin-right: 20px;
        text-align: center;

        a {
          padding: 10px 0;
          display: block;
          color: #fff;
          span {
            font-size: 16px;
          }
        }
        /*tab选中后高亮*/
        .router-link-active {
          width: 100%;
          text-decoration: none;
          color: #fff;
          background-color: #ff9801;
          //active 文字颜色

        }
      }
      .active {
        border-bottom: 1px solid #0d55d2;
      }
    }
  }
}
</style>
