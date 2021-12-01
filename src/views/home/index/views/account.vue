<template>
  <!--修改密码-->
  <div class="outer">
    <div class="top">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconfanhui" />
      </svg>
      <button @click="back">返回</button>
    </div>
    <div class="center">
      <div>
        <p>手机号码：</p>
        <span class="phone">{{mydata.username}}</span>
      </div>

      <div>
        <p>经销商名称：</p>
        <span class="phone">{{mydata.agentInfoName}}</span>
      </div>
      <div>
        <p>联系地址：</p>
        <span class="phone">{{mydata.regionName}}</span>
      </div>
      <div>
        <p>联系人：</p>
        <span class="phone">{{mydata.realName}}</span>
      </div>

      <div>
        <p>联系人电话：</p>
        <span class="phone">{{mydata.username}}</span>
      </div>
      <div class="footer">
        <button>保存</button>
        <button class="button2">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      mydata: {}
    };
  },
  methods: {
    back: function() {
      this.$router.push("/service/personal");
    }
  },
  async mounted() {
    console.log("进入我的账户中心:");

    let res = await this.api.getPersonalInformation();
    console.log("账户中心返回：");
    this.mydata = res.data.userInfo;
    console.log(res.data.userInfo);
  }
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*最外层布局*/

span.phone {
  flex: 6;
  font-size: 18px;
}

/*中间那一块*/
.center {
  margin-left: 161px;

  line-height: 50px;
}
p {
  flex: 3;
  font-size: 18px;
  color: #666666;
}
/*中间那一块里面的div*/
.center div {
  width: 400px;
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 50px;
}
/*中间那一块的表单*/
.center input {
  flex: 6;
  height: 50px;
  border: 1px solid #dfdfdf;
  padding-left: 22px;
}
.footer {
  margin-left: 125px;
  height: 50px;
  width: 300px;
  visibility: hidden;
}

/*底部按钮*/
.footer button {
  margin-top: 10px;
  width: 125px;
  height: 50px;
  border: 1px solid #f6a33e;
  text-align: center;
  color: #f6a33e;
  background: white;
  border-radius: 3px;
}
/*底部按钮鼠标经过的样式*/
.footer button:hover {
  background: #f6a33e;
  color: #ffffff;
}
/*第二个按钮*/
.button2 {
  margin-left: 25px;
}
</style>
