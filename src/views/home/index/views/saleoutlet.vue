<template>
  <!--销售网点-->
  <div
    class="outer2"
    v-loading="loading"
    element-loading-text="请不要关闭或者刷新页面"
  >
    <div class="top2">
      <p>网点积分概览</p>
    </div>
    <div class="score_census" style="height: 123px">
      <div class="item_census" style="height: 123px">
        <div class="line1">30000</div>
        <div class="line2" @click="handleCensusScore1">总积分</div>
      </div>
      <div class="item_census" style="height: 123px">
        <div class="line1">24000</div>
        <div class="line2" @click="handleCensusScore2">可用积分</div>
      </div>
      <div class="item_census" style="height: 123px">
        <div class="line1">8000</div>
        <div class="line2" @click="handleCensusScore3">已使用积分</div>
      </div>
      <div class="item_census" style="height: 123px">
        <div class="line1" style="color: #ff3000">3000</div>
        <div class="line2" @click="handleCensusScore4">即将到期积分</div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="title">网点名称:{{ item.name }}</div>
        <div class="score_census">
          <div class="item_census">
            <div class="line1">{{ item.val1 }}</div>
            <div class="line2" @click="handleScore1">总积分</div>
          </div>
          <div class="item_census">
            <div class="line1">{{ item.val2 }}</div>
            <div class="line2" @click="handleScore2">可用积分</div>
          </div>
          <div class="item_census">
            <div class="line1">{{ item.val3 }}</div>
            <div class="line2" @click="handleScore3">已使用积分</div>
          </div>
          <div class="item_census">
            <div class="line1" style="color: #ff3000">{{ item.val4 }}</div>
            <div class="line2" @click="handleScore4">即将到期积分</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pageInfo">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "saleoutlet",
  data() {
    return {
      list: [
        {
          name: "宁波聚联科技有限公司（市代）",
          val1: 10000,
          val2: 8000,
          val3: 3000,
          val4: 1000,
        },
        {
          name: "宁波聚联科技有限公司（市代）",
          val1: 10000,
          val2: 8000,
          val3: 3000,
          val4: 1000,
        },
        {
          name: "宁波聚联科技有限公司（市代）",
          val1: 10000,
          val2: 8000,
          val3: 3000,
          val4: 1000,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo: {},
      loading: false,
      param: {},
      info: {},
    };
  },
  async mounted() {
    //改成经销商Id
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
    await this.getList();
  },

  methods: {
    handleCurrentChange(e) {
      this.loading = true;
      this.pageNum = e;
      this.getList();
    },
    handleSizeChange(val) {
      this.loading = true;
      this.pageSize = val;
      this.pageNum = 1;
      this.getList();
      console.log(`每页 ${val} 条`);
    },
    async getList() {
      this.param = {
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userInfo.userId,
      };
      let data = await this.api.getNetWorkScoreList(this.param);
      console.log({data});
      // if (data.code == 0) {
      //   this.loading = false;
      //   this.total = data.data.total;
      //   this.list = data.data.result;
      //   this.list.forEach((item) => {
      //     item.delieryTime = item.delieryTime
      //       ? item.delieryTime.split(" ")[0]
      //       : "";
      //     item.crtTm = item.crtTm ? item.crtTm.split(" ")[0] : "";
      //     if (item.isShortTime) {
      //       item.agentName = `${item.agentName}(临时客户-${item.shortTimeName})`;
      //     }
      //   });
      // }
    },
    // 总积分一栏
    handleCensusScore1() {
      this.$router.push("./outletScoreCensus?type=1");
    },
    handleCensusScore2() {
      this.$router.push("./outletScoreCensus?type=2");
    },
    handleCensusScore3() {
      this.$router.push("./outletScoreCensus?type=3");
    },
    handleCensusScore4() {
      this.$router.push("./outletScoreCensus?type=4");
    },
    // 积分项一栏
    handleScore1() {
      this.$router.push("./outletScoreDetail?type=1");
    },
    handleScore2() {
      this.$router.push("./outletScoreDetail?type=2");
    },
    handleScore3() {
      this.$router.push("./outletScoreDetail?type=3");
    },
    handleScore4() {
      this.$router.push("./outletScoreDetail?type=4");
      // console.log(111);
    },
  },
  components: {},
};
</script>
<style scoped lang="less">
/*最外层布局*/
.outer2 {
  padding-top: 14px;
  width: 950px;
  background: white;
}
/*顶部布局*/
.top2 {
  padding-left: 15px;
  font-size: 18px;
  color: #333333;
  border-bottom: 1px solid #e1e1e1;
}
/*我的订单段落*/
.top2 p {
  display: block;
  width: 100%;
  height: 70px;
  line-height: 70px;
}
.score_census {
  width: 100%;
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item_census {
    padding: 34px 0 29px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .line1 {
      font-size: 30px;
      color: #000;
      text-align: center;
      margin-bottom: 17px;
    }
    .line2 {
      font-size: 16px;
      text-decoration: underline;
      color: #606060;
      text-align: center;
      cursor: pointer;
    }
  }
}
.list {
  .item {
    border-bottom: 1px solid #e1e1e1;
    .title {
      font-size: 16px;
      color: #666666;
      margin: 0px 35px;
      padding: 15px 0px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
    }
    .score_census {
      background: #fff;
      .item_census {
        padding: 19px 0px;
        .line1 {
          font-size: 24px;
          margin-bottom: 12px;
        }
        .line2 {
          font-size: 14px;
        }
      }
    }
  }
}
.pageInfo {
  padding: 20px;
}
</style>
