<template>
  <!--我的经销商-->
  <div class="outer">
    <div class="top">
      <p class="title">我的经销商</p>
    </div>
    <ul>
      <li v-for="msg in msgList" :key="msg.id">
        <div class="container">
         <!-- <div class="company">经销商简称：{{msg.name}}</div>-->
          <div class="company">经销商全称：{{msg.corpName}}</div>
          <div class="people">
            <span>联系人：{{msg.linkMan}}</span>
            <span class="phone1">联系电话：{{msg.linkPhone}}</span>
          </div>
          <div class="address11">收货地址：{{msg.address}}</div>
        </div>
      </li>
    </ul>
    <div class="footer1">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "distributor",
  data() {
    return {
      userInfo: {},
      msgList: [],
      pageNum: 1,
      total: 0,
      form: {
        userId: "",
        extUserIds: "",
        saleType: "",
        pageSize: 10,
        pageNum: 1,
        queryType: 1
      }
    };
  },
  mounted() {
    this.userInfo = JSON.parse(this.until.loGet("userInfo"));
    this.getList();
  },
  methods: {
    async getList() {
      this.form.userId = this.userInfo.userId;
      this.form.extUserIds = this.userInfo.extUserIds;
      if (this.userInfo.userType === 1) {
        this.form.groupLeaderId = this.userInfo.userId;
      }
      if (this.userInfo.userType === 2) {
        this.form.groupLeaderId = this.userInfo.groupLeaderId;
      }

      // 2019年11月1日 总经理的时候去掉exceptType为true
      if (
        this.userInfo.userType == 1 ||
        this.userInfo.userType == 3 
      ) {
        this.form.exceptType = true;
      } else {
        this.form.exceptType = false;
      }

      let { result, total } = await this.api.getDistributor(this.form);

      this.msgList = result;
      this.total = total;
    },
    //点击处理当前页,定义的时候没有参数，调用的时候回自动加一个e
    handleCurrentChange(e) {
      this.form.pageNum = e;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.form.pageSize = val;
      this.getList();
    }
  }
};
</script>

<style scoped lang="less">
/*最外层布局*/
.outer {
  padding-top: 14px;
  min-height: 500px;
  width: 950px;
  background: white;
}
p.title {
  margin-top: 20px;
  color: #333333;
  font-size: 18px;
}
.top {
  padding-left: 35px;
  width: 914px;
  height: 50px;
  border-bottom: 1px solid #e1e1e1;
}
.container {
  padding-top: 25px;
  padding-left: 35px;
  display: flex;
  display: -webkit-flex;
  flex-flow: column wrap;
  height: 85px;
  border-bottom: 1px solid #e1e1e1;
  > div {
    width: 100%;
    color: #666666;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .people{
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    >span{
      flex: 1;
    }
  }
}
.container:hover {
  background: whitesmoke;
}

.footer1 {
  margin-top: 30px;
  padding-left: 35px;
  width: 914px;
  height: 75px;
}
</style>
