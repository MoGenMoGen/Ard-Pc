<template>
  <div id="center" v-bind:style="{backgroundImage:'url(' + bgImgUrl+ ')'}">
    <div class="form1">
      <p class="p3">登录</p>
      <div id="div1">
        <img class="form_img" id="img1" src="../pic/ic-user.png" />
        <input type="text" placeholder="请输入手机号码" v-model="username" />
      </div>

      <div id="div2">
        <img class="form_img" id="img2" src="../pic/ic-pwd.png" />
        <input type="password" placeholder="请输入密码" v-model="password" @keyup.enter="login" />
      </div>

      <!--<button id="button1_forget" @click="changeTab">忘记密码?</button>-->

      <div class="center_button">
        <button class="submit" @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login1",
  data() {
    return {
      username: "",
      password: "",
      bgImgUrl: ""
    };
  },
  mounted() {
    //得到登录背景
    this.getLoginBgImage();
  },
  methods: {
    changeTab() {
      this.$router.push("/forgetpass");
    },
    async getLoginBgImage() {
      let res = await this.api.getBaseDataOfAd({ cd: "loginOfBg" });
      this.bgImgUrl = res.data[0].sysAdVo.srcUrl;
    },
    async login() {
      let param = {
        username: this.username,
        password: this.password
      };

      let res = await this.api.postSysLogin(param);
      if (res.code === 0) {
        this.until.loSave("userInfo", JSON.stringify(res.data.userInfo));
        this.$message({
          message: "登录成功",
          type: "success"
        });

        if (res.data.userInfo.loginTotal === 0) {
          this.until.href("../home/index.html#/service/changepass")
        } else {
          setTimeout(() => {
            const redirect = this.$route.query.redirect;
            if (redirect) {
              this.$router.push(redirect);
            } else {
              // this.$router.back();
              //跳转首页
              this.until.href("../home/index.html");
            }
          }, 1000);
        }
      }
    }
  }
};
</script>

<style scoped>
#center {
  overflow: hidden;
  width: 100%;
  min-height: 78vh;
  position: relative;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
}

.form1 {
  position: absolute;
  overflow: hidden;
  top: 50%;
  right: 18%;
  background-color: rgba(255, 255, 255, 0.9);
  width: 370px;
  height: 340px;
  transform: translateY(-50%);
}

#div1 {
  margin-top: 58px;
}
#div2 {
  margin-top: 23px;
}
.p3 {
  margin-bottom: 0px;
  border: 0px;
  margin-top: 40px;
  color: #333333;
  font-family: "Microsoft YaHei UI";
  text-align: center;
  font-size: 20px;
}

.form_img {
  margin-left: 61px;
  width: 18px;
  height: 20px;
}

input {
  color: #999;
  border: 0px;
  outline: none;
  margin-left: 9px;
  border-bottom: 1px solid #dfdfdf;
  padding: 5px;
  padding-left: 26px;
  background-color: rgba(255, 255, 255, 0);
}

#button1_forget {
  position: absolute;
  left: 225px;
  top: 200px;
  background: transparent; /*完全透明*/
  border: 0px;
  color: #3f51b5;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.submit {
  outline: none;
  width: 250px;
  height: 40px;
  border-radius: 25px;
  background-color: #ff9801;
  color: #ffffff;
  border: 0px;
  font-size: 18px;
  cursor: pointer;
}
.center_button {
  margin-top: 63px;
  text-align: center;
}
</style>
