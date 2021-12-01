<template>
  <!--我的消息-->
  <div class="outer">
    <div class="top">
      <p class="title">我的消息</p>
    </div>
    <div>
      <el-tabs stretch="stretch" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="系统消息" name="first"></el-tab-pane>
        <el-tab-pane label="用户消息" name="second"></el-tab-pane>
      </el-tabs>
    </div>

    <ul>
      <li v-for="(msg,index) in msgList" :key="msg.id">
        <div class="div_read">
          <button class="btnread" v-show="!msg.isRead"></button>
        </div>
        <div class="container" @click="toDetail(msg.msgId)">
          <p class="message">{{msg.title}}：{{msg.content}}</p>
          <p class="date">{{msg.publishTime}}</p>
        </div>
        <div class="div_button">
          <button class="btn_delete" @click="toDelet(msg.msgId,index)">删除</button>
        </div>
      </li>
    </ul>
    <div class="footer1">
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
  name: "message",
  data() {
    return {
      msgList: [],
      pageNum: 1,
      total: 0,
      pageSize: 10,
      activeName: "first",
      queryType: 1
    };
  },
  methods: {
    //点击处理当前页,定义的时候没有参数，调用的时候回自动加一个e

    async getList() {
      if (this.activeName == "first") {
        this.queryType = 1;
      } else {
        this.queryType = 2;
      }
      console.log("type的值：" + this.queryType);
      let userInfo = JSON.parse(this.until.loGet("userInfo"));
      let param = {
        userId: userInfo.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryType: this.queryType
      };

      let res = await this.api.getMessage(param);
      console.log("发起网络请求");
      this.msgList = res.data.result;
      this.total = res.data.total;
      console.log(res.data);
    },
    //删除消息
    toDelet(id, index) {
      console.log(id);
      let userInfo = JSON.parse(this.until.loGet("userInfo"));
      this.api.messageDelet(id, userInfo.userId).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        //根据索引删除列表项
        this.msgList.splice(index, 1);
        //同步底部分页框总数和列表数量
        this.total = this.total - 1;
      });
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.getList();
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.pageNum = 1;
      this.getList();
    },
    toDetail(id) {
      //首先将列表的红点去掉
      let filter = this.msgList.filter(item => item.msgId === id);
      filter[0].isRead = true;

      //然后跳转到消息详情页
      this.$router.push({
        path: "/service/messagedetail",
        query: {
          id: JSON.stringify(id)
        }
      });
    },
    handleClick(tab, event) {
      console.log("tab标签的值是：");

      console.log(this.activeName);
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
/*最外层布局*/
.outer {
  padding-top: 14px;
  min-height: 700px;
  width: 950px;
  background: white;
}
p.title {
  margin-top: 15px;
  color: #333333;
  font-size: 18px;
}
.top {
  padding-left: 35px;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 20px;
}
.tab {
  padding-left: 35px;
}
.container {
  padding-top: 30px;
  padding-left: 25px;
  width: 714px;
  height: 60px;
  flex: 32;
}
.div_button {
  width: 214px;
  flex: 8;
}
.btnread {
  background: red;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  margin-left: 20px;
}
.div_read {
  flex: 1;
}
.btn_delete {
  width: 96px;
  height: 36px;
  border: 1px solid #f6a33e;
  color: #f6a33e;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  background: white;
  border-radius: 3px;
}
.btn_delete:hover {
  background: #f6a33e;
  color: white;
}
li:hover {
  background: whitesmoke;
}

li {
  align-items: center;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e1e1e1;
}
p.message {
  color: #666666;
  font-size: 14px;
  /*文字太长，显示省略号，*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
  margin-right: 50px;
}
p.date {
  color: #999999;
  font-size: 14px;
}
.footer1 {
  margin-top: 30px;
  padding-left: 35px;
  width: 914px;
  height: 75px;
}
</style>
