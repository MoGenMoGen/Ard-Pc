<template>
  <!--查看物流页面-->
  <div class="express">
    <div class="center" v-for="(item, index) in expressList" :key="index">
      <p>物流动态：{{item.express.status===1?'已签收':'运输中'}}</p>
      <p>
        <span>物流公司：{{item.express.expressComNm}}</span>
        <span class="span2">物流编号：{{item.express.expressNum}}</span>
        <!-- <span class="span2">官方电话：97889</span> -->
      </p>
      <p>物流动态：</p>

      <div class="footer1">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in item.data"
            v-show="item.showMore || index===0"
            :key="index"
            :color="activity.color"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
        <el-button size="small" type="text" v-if="item.showMore" @click="showMoreOp(item,index)">收起《</el-button>
        <el-button size="small" type="text" v-else @click="showMoreOp(item,index)">更多》</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "express",
  props: {
    expressList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      info: {},
      list: [],
      reverse: false
    };
  },
  mounted() {
    // this.id = this.$route.query.id;
    // this.getInfo();
  },
  methods: {
    // async getInfo() {
    //   const qry = new this.Query();
    //   qry.buildWhereClause("orderId", this.id, "EQ");
    //   const param = qry.getParam();

    //   const res = await this.api.logistics(param);
    //   //自己组合数据
    //   res.kuaidi.forEach((kuaidi, index) => {
    //     kuaidi.express = res.page.records[index].crmOrderExpressInfoVo;
    //     kuaidi.data.forEach((item, index) => {
    //       if (index === 0) {
    //         item.color = "#0bbd87";
    //       }
    //     });
    //     kuaidi.showMore = false;

    //     this.$set(res.kuaidi, index, kuaidi);
    //   });

    //   this.expressList = res.kuaidi;
    // },
    back() {
      this.until.back();
    },
    showMoreOp(item, index) {
      item.showMore = !item.showMore;
      this.$set(this.expressList, index, item);
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*最外层布局*/
.outer {
  .top {
    border-bottom: 1px solid #e1e1e1;
  }
}

/*中间部分*/
.center {
  margin-left: 33px;
}
.center p {
  margin-top: 31px;
  color: #666666;
  font-size: 18px;
}
.span2 {
  margin-left: 124px;
}
/*底部*/
.footer1 {
  margin-left: 33px;
  margin-top: 30px;
  .el-button--text {
    color: #17b3a3;
  }
}
</style>
