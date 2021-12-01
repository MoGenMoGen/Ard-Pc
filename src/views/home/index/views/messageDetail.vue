<template>
  <!--修改密码-->
  <div class="outer">
    <div class="top">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconfanhui" />
      </svg>
      <button @click="back">返回</button>
    </div>

    <div class="header1">消息详情</div>

    <div class="center">
      <div class="title">
        <span>标题：</span>
        <p>{{msg.title}}</p>
      </div>
      <div class="content">
        <span>内容：</span>
        <p v-html="msg.content"></p>
      </div>
      <div class="date">
        <span>时间：</span>
        <p>{{msg.publishTime}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "feedback",
  data() {
    return {
      msgId: "",
      msg: {}
    };
  },
  mounted() {
    let userInfo = JSON.parse(this.until.loGet("userInfo"));

    this.msgId = this.$route.query.id;

    this.isRead(this.msgId, userInfo.userId);
  },
  methods: {
    back: function() {
      this.$router.back();
    },
    isRead(msgId, userId) {
      this.api.getMessageRead(msgId, userId).then(res => {
        if (res.code == 0) {
          this.msg = res.data;
        } else {
          console.log("返回信息：" + res.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
/*最外层布局*/
.outer {
  .top {
    padding: 10px 0 20px;
    border-bottom: 1px solid #e1e1e1;
  }
}

.header1 {
  margin-top: 20px;
  margin-left: 33px;
  color: #999999;
  font-size: 16px;
}
.center {
  margin-left: 33px;
  display: flex;
  display: -webkit-flex;
  flex-flow: column wrap;
  > div {
    flex: 1;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    span {
      width: 50px;
    }
    p {
      flex: 1;
    }
  }
}
</style>
