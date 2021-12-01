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
        <p>原密码：</p>
        <input type="password" placeholder="请输入原密码" v-model="oldPassWord" />
      </div>
      <div>
        <p>新密码：</p>
        <input type="password" placeholder="请输入新密码" v-model="newPassWord" />
      </div>
      <div>
        <p>确认密码：</p>
        <input type="password" placeholder="请再次输入新密码" v-model="confirmPassWord" />
      </div>

      <div class="footer">
        <button @click="changePass">保存</button>
        <button class="button2" @click="back">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "feedback",
  data() {
    return {
      oldPassWord: "",
      newPassWord: "",
      confirmPassWord: ""
    };
  },
  methods: {
    back: function() {
      this.$router.push("/service/personal");
    },
    async changePass() {
      if (this.oldPassWord == "") {
        this.$message.error("请输入原密码");
      } else if (this.newPassWord == "") {
        this.$message.error("请输入新密码");
      } else if (this.confirmPassWord == "") {
        this.$message.error("请输入确认密码");
      } else if (this.confirmPassWord != this.newPassWord) {
        this.$message.error("两次输入密码不同");
      } else {
        let param = {
          oldPassWord: this.oldPassWord,
          newPassWord: this.newPassWord,
          confirmPassWordJ: this.confirmPassWordJ
        };
        let res = await this.api.postChangePsd(param);
        if (res.code == "0") {
          this.$message({ message: "修改成功！", type: "success" });
        } else {
          this.$message.error(res.message);
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*最外层布局*/
.outer {
  .top {
    padding: 10px 0 20px;
    border-bottom: 1px solid #e1e1e1;
  }
}
/*中间那一块*/
.center {
  margin-left: 161px;

  line-height: 50px;
}
p {
  flex: 2;
  font-size: 18px;
  color: #666666;
}
/*中间那一块里面的div*/
.center div {
  width: 400px;
  display: flex;
  margin-top: 35px;
  margin-bottom: 35px;
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
  margin-left: 95px;
  height: 50px;
  width: 300px;
}

/*底部按钮*/
.footer button {
  width: 140px;
  height: 50px;
  border: 1px solid #f6a33e;
  text-align: center;
  color: #f6a33e;
  cursor: pointer;
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
