<template>
  <div class="shop">
    <div id="list">
      <div class="list" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
        <div class="img" :style="{backgroundImage:'url('+item.imgMainUrl+')'}"></div>
        <p>{{item.name}}</p>
        <p :title="item.specName">规格：{{item.specName}}</p>
      </div>
    </div>
    <div class="pageNum">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ilikelog from "../images/ilikelog.png";
export default {
  data() {
    return {
      catId: "",
      pageNum: 1,
      pageSize: 20,
      total: 0,
      ilikelog,
      list: []
    };
  },
  watch: {
    $route(to, from) {
      console.log("route");
      console.log(to.query.id);
      this.catId = to.query.id ? to.query.id : "";
      this.pageNum = 1;
      this.getProList();
    }
  },
  mounted() {
    console.log("shopList");
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
    this.catId = this.$route.query.id ? this.$route.query.id : "";
    this.getProList();
  },
  methods: {
    async getProList() {
      let param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        catId: this.catId
      };
      let data = await this.api.getProList(param);
      this.total = data.total;
      this.list = data.result;
      this.list.map(
        item =>
          (item.imgMainUrl =
            !item.imgMainUrl || item.imgMainUrl === "null"
              ? this.ilikelog
              : item.imgMainUrl)
      );
      // console.log(data)
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.getProList();
    },
    toDetail(item) {
      this.$router.push({
        path: "shopDetail",
        query: {
          id: item.id
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.shop {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  #list {
    width: 1228px;
    margin: 0 auto;
    overflow: hidden;
    .list {
      float: left;
      width: 285px;
      border: 1px solid #dfdfdf;
      margin-left: 20px;
      margin-top: 20px;
      cursor: pointer;
      .img {
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 285px;
        height: 285px;
      }
      p {
        display: block;
        font-size: 16px;
        line-height: 40px;
        color: #666666;
        padding: 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .pageNum {
    width: 1200px;
    margin: 20px auto;
  }
}
</style>
