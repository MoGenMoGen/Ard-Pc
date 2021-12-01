<template>
  <div class="myHeader">
    <div class="header-wrap">
      <div class="ic-saoma">
        <img :src="ilikeWechat" />
      </div>
      <div id="top">
        <div class="log">
          <!--埃瑞德图标的链接-->
          <a href="../home/index.html">
            <img :src="tradeLog" alt />
          </a>
        </div>
        <div class="ic-phone">
          <img class="img1" src="./images/ic-phone.png" />
          400-661-0770
        </div>
        <div class="ic-message" @click="mymessage">
          <img class="img1" src="./images/ic-message.png" />
          消息中心
        </div>
        <div class="ic-bus" @click="toCart">
          <img class="img1" src="./images/ic-bus.png" />购物车
          <span>{{cartNum}}</span>
          件
        </div>
        <div class="ic-user" v-if="userInfo.realName" @click="toCenter">
          <img class="img1" src="./images/ic-user.png" />
          {{userInfo.realName}}
        </div>
        <div class="ic-user" v-else>
          <a href="./login.html">
            <img src="./images/ic-user.png" />登录
          </a>
        </div>
        <div class="exit" v-if="userInfo.realName" @click="toQuit">【退出】</div>
      </div>
      <div class="header-sidebar">
        <div class="sidebar">
          <div
            v-for="(item) in sidebarList"
            :key="item.ID"
            @mouseover="showClassify(item)"
            @mouseleave="closeClassify(item)"
          >

            <p :class="{active:currentPage==item.itemLink}" @click="choose(item)">{{item.content}}</p>
            <div class="classify" v-if="item.ID==3" :style="{width:classifyNum*num+width+'px'}" v-show="classifyShow">
              <img :src="topArrow" />
              <!--<i class="el-icon-caret-top"></i>-->
              <div class="classifyList" :style="{width:classifyNum*num+width+'px'}">
                <div
                  v-for="(item,index) in classifyList"
                  :key="item.id"
                  :class="{check:item.check}"
                  @mouseover="smallClassify(index)"
                >
                  <p @click.stop="chooseClassify(item.id)">{{item.name}}</p>
                  <div class="samllClassify" v-show="smallClassifyList.length>0 && item.check" :style="{left:classifyNum*num+width+'px',width:sclassifyNum*num+width+12+'px'}">
                    <img :src="topArrow" />
                    <div :style="{width:sclassifyNum*num+width+'px'}">
                      <p
                        v-for="i in smallClassifyList"
                        :key="i.id"
                        @click.stop="chooseClassify(item.id,i.id)"
                        :style="{width:sclassifyNum*num+width+'px'}"
                      >{{i.name}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topArrow from "./images/topArrow.png";
import tradeLog from "./images/ilike-log.png";
import ilikeWechat from "./images/ilike-crm-logo.jpg";
export default {
  props: {},
  data() {
    return {
      width:50,//左右边距总和
      num:15,//倍数
      classifyNum:5,
      sclassifyNum:5,
      cartNum: 0,
      userInfo: {},
      ilikeWechat,
      topArrow,
      tradeLog,
      classifyShow: false,
      smallClassifyShow: false,
      currentPage: "",
      classifyList: [],
      smallClassifyList: [],
      sidebarList: [
        {
          ID: 1,
          content: "首页",
          itemLink: "/home"
        },
        {
          ID: 2,
          content: "高端定制",
          itemLink: "/highcustom"
        },
        {
          ID: 3,
          content: "ILI商城",
          itemLink: "/shop"
        },
        {
          ID: 4,
          content: "案例展示",
          itemLink: "http://www.ilikeit-runner.com/"
        },
        {
          ID: 5,
          content: "个人中心",
          itemLink: "/service"
        }
      ]
    };
  },
  watch: {
    "store.state.cartNum": function(e) {
      console.log("购物车");
      this.cartNum = e;
    },
    $route(to, from) {
      this.currentPage = to.matched[0].path;
    }
  },
  async mounted() {
    this.currentPage = this.$route.matched[0].path;
    this.classifyList = await this.api.getClassify();
    this.classifyList.forEach(item=>{
      if(this.classifyNum<item.name.length){
        this.classifyNum = item.name.length
      }
    })
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      this.getCartNum();
    }
  },
  methods: {
    toCenter() {
      this.$router.push("/service/personal");
    },
    mymessage() {
      if (!this.userInfo.realName) {
        this.$confirm("您还没有登录，立即登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.until.href("../home/login.html");
          })
          .catch(() => {});
        return;
      }
      this.$router.push("/service/message");
    },
    toCart() {
      if (!this.userInfo.realName) {
        this.$confirm("您还没有登录，立即登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.until.href("../home/login.html");
          })
          .catch(() => {});
        return;
      }
      this.$router.push("/highcustom/cart");
    },
    async getCartNum() {
      const qry = new this.Query();
      qry.buildPageClause(1, 10);

      const param = qry.getParam();
      let data = await this.api.getCartBatchListByPage(param);
      if (data.code == 0) {
        this.store.commit("setCartNum", data.data.total);
      }
    },
    //退出
    async toQuit() {
      let data = await this.api.getSysLoginOut();
      if (data.code == 0) {
        this.until.loRemove("userInfo");
        this.until.loRemove("cartList");
        this.until.loRemove("tableData");
        this.store.commit("setCartNum", 0);
        this.$message({
          message: "退出成功",
          type: "success"
        });
        setTimeout(() => {
          this.until.href("./login.html");
        }, 1500);
        this.userInfo = {};
      }
    },
    smallClassify(index) {

      this.classifyList.forEach((item, i) => {
        if (i == index) {
          item.check = true;
        } else {
          item.check = false;
        }
        this.$set(this.classifyList, i, item);
      });

      if (
        this.classifyList[index].children &&
        this.classifyList[index].children.length > 0
      ) {
        this.smallClassifyList = this.classifyList[index].children;
        this.sclassifyNum = 5
        this.smallClassifyList.forEach(item=>{
          let name = item.name.replace('（',"").replace('）','').replace('-','');
          // let name = item.name
          if(this.sclassifyNum<name.length){
            this.sclassifyNum = name.length
          }
        })
        console.log('数量：'+this.sclassifyNum)
      } else {
        this.smallClassifyList = [];
      }

    },
    closeClassify(item) {
      if (item.ID == 3) {
        this.classifyShow = false;
        this.classifyList.forEach((item, i) => {
          item.check = false;

          this.$set(this.classifyList, i, item);
        });
        this.smallClassifyList = [];
      }
    },
    showClassify(item) {
      if (item.ID == 3) {
        this.classifyShow = true;
      } else {
        this.classifyShow = false;
      }
    },
    //页面跳转
    choose(item) {
      if (
        (item.itemLink == "/service" ||
          item.itemLink == "/highcustom" ||
          item.itemLink == "/shop") &&
        !this.userInfo.realName
      ) {
        this.$confirm("您还没有登录，立即登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.until.href("../home/login.html");
          })
          .catch(() => {});
        return;
      }
      if (item.ID === 4) {
        window.open(item.itemLink);
        // this.until.href(item.itemLink);
        return;
      }
      this.currentPage = item.itemLink;
      this.$router.push({
        //你需要接受路由的参数再跳转
        path: item.itemLink
      });
    },
    chooseClassify(big, small) {
      if (!this.userInfo.realName) {
        this.$confirm("您还没有登录，立即登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.until.href("../home/login.html");
          })
          .catch(() => {});
        return;
      }
      this.currentPage = "/shop";
      let url = "";
      if (small) {
        url = big + "/" + small;
      } else {
        url = big + "/";
      }
      // console.log(url)
      this.classifyShow = false;
      this.$router.push({
        //你需要接受路由的参数再跳转
        path: "/shop",
        query: {
          id: url
        }
      });
    }
  }
};
</script>

<style lang='less'>
/*顶部最外层套一个标签*/
#div_img {
  display: inline;
}
#top {
  /*弹性布局*/
  display: flex;
  /*设置元素不折行*/
  flex-wrap: nowrap;
  /*设置最小宽度，在屏幕缩小的时候看不到尾部*/
  min-width: 1200px;
  width: 100%;
  padding-top: 33px;
  padding-bottom: 33px;
  align-items: center;
  font-size: 16px;
}
.ic-saoma {
  /*保证div在窗口缩小的时候不换行*/
  position: absolute;
  right: 2%;
  top: 0;
  img {
    width: 120px;
    height: 120px;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
}
.exit {
  /*保证div在窗口缩小的时候不换行*/
  white-space: nowrap;
  cursor: pointer;
  margin-left: 5%;
  display: inline;
}

.ic-user {
  /*保证div在窗口缩小的时候不换行*/
  white-space: nowrap;
  cursor: pointer;
  margin-left: 5%;
  display: inline;
  img {
    width: 13px;
    margin-right: 8px;
  }
}
.ic-bus {
  /*保证div在窗口缩小的时候不换行*/
  white-space: nowrap;
  cursor: pointer;
  margin-left: 5%;
  display: inline;
  span {
    color: #ff4d51;
  }
}
.ic-message {
  /*保证div在窗口缩小的时候不换行*/
  white-space: nowrap;
  cursor: pointer;
  margin-left: 5%;
  display: inline;
}

.ic-phone {
  /*保证div在窗口缩小的时候不换行*/
  white-space: nowrap;
  margin-left: 5%;
  display: inline;
}
.log {
  margin-left: 12.5%;
  display: inline;
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
  position: relative;
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  a {
    color: #666666;
  }

  .img1 {
    height: 20px;
    width: 20px;
    margin-right: 8px;
    vertical-align: top;
  }
  .header-sidebar {
    width: 100%;
    margin: 0 auto;
    background-color: #000;
    .sidebar {
      margin: 0 auto;
      width: 1200px;
      display: -webkit-flex;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      > div {
        flex: 1;
        margin-right: 20px;
        text-align: center;
        position: relative;
        .classify {
          position: absolute;
          left: 45px;
          width: 150px;
          z-index: 999;
          line-height: 24px;
          padding-top: 10px;
          img {
            width: 12px;
            height: 6px;
            display: block;
            margin: 0 auto;
          }
          i {
            color: rgba(40, 40, 40, 0.8);
          }
          .classifyList {
            padding: 5px 0;
            border-radius: 5px;
            background: rgba(40, 40, 40, 0.8);
            .check {
              background: #ff9801;
              color: #ffffff;
            }
            > div {
              position: relative;
              > p {
                border-bottom: 1px solid transparent;
                border-color: transparent;
                border-color: rgba(255, 255, 255, 0.2);
              }
              .samllClassify {
                position: absolute;
                top: 0;
                left: 150px;
                /*width: 152px;*/
                width: auto;
                img {
                  /*width: 12px;*/
                  /*height: 6px;*/
                  float: left;
                  margin-top: 18px;
                  transform: rotate(-90deg);
                }
                > div {
                  box-sizing: border-box;
                  padding: 5px 0;
                  margin-left: 8.5px;
                  /*display: inline-block;*/
                  border-radius: 5px;
                  /*width: 140px;*/
                  background: rgba(40, 40, 40, 0.8);
                  p {
                    cursor: pointer;
                    display: block;
                    text-align: center;
                    padding: 15px 0;
                    color: #ffffff;
                    border-bottom: 1px solid transparent;
                    border-color: transparent;
                    border-color: rgba(255, 255, 255, 0.2);
                    &:last-of-type {
                      border-bottom: 0;
                    }
                  }
                  p:hover {
                    background: #ff9801;
                    color: #ffffff;
                  }
                }
              }
            }
          }
          p {
            cursor: pointer;
            padding: 15px 0;
            color: #ffffff;
            border-bottom: 1px solid transparent;
            border-color: transparent;
            border-color: rgba(255, 255, 255, 0.2);
            &:last-of-type {
              border-bottom: 0;
            }
          }
        }
        > p {
          padding: 10px 0;
          display: block;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }
        /*tab选中后高亮*/
        .active {
          width: 100%;
          text-decoration: none;
          color: #fff;
          background-color: #ff9801;
          //active 文字颜色
        }
      }
    }
  }
}
</style>
