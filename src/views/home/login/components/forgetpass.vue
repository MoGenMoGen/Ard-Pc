<template>
  <div id="center" :style="{backgroundImage:'url('+bgImgUrl+')'}">
    <div class="form1">
      <p class="p3">忘记密码</p>
      <div id="div3">
        <img class="form_img" id="img3" src="../pic/ic-user.png" />
        <input class="form_input" id="inpu3" type="text" placeholder="请输入手机号码" />
      </div>
      <div id="div4">
        <img class="form_img" id="img4" src="../pic/ic-yanzhengma.png" />
        <input class="form_input" id="inpu4" type="text" placeholder="请输入验证码" />
      </div>
      <button id="button1_send">发送验证码</button>
      <div id="div5">
        <img class="form_img" id="img5" src="../pic/ic-pwd.png" />
        <input class="form_input" id="input5" type="password" placeholder="请输入密码" />
      </div>

      <div id="div6">
        <img class="form_img" id="img6" src="../pic/ic-pwd.png" />
        <input class="form_input" id="input6" type="password" placeholder="请再次输入密码" />
      </div>
      <div id="center_button2">
        <button class="submit">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgetPass",
  data() {
    return {
      bgImgUrl: ""
    };
  },
  mounted() {
    this.getLoginBgImage();
  },
  methods: {
    async getLoginBgImage() {
      let res = await this.api.getBaseDataOfAd({ cd: "loginOfBg" });
      this.bgImgUrl = res.data[0].sysAdVo.srcUrl;
    }
  }
};
</script>

<style scoped>
body {
  margin: 0px;
  padding: 0px;
}

#center {
  overflow: hidden;
  width: 100%;
  height: 680px;
  position: relative;
  background-position: top center;
  background-size: contain;
  background-repeat: no-repeat;
}

.form1 {
  position: absolute;
  overflow: hidden;
  margin-top: 73px;
  right: 18%;
  background-color: rgba(255, 255, 255, 0.6);
  width: 370px;
  height: 400px;
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
#div3 {
  margin-top: 27px;
}
#div4 {
  margin-top: 30px;
}
#div5 {
  margin-top: 30px;
}
#div6 {
  margin-top: 30px;
}

.form_input {
  color: #999999;
  border: 0px;
  outline: none;
  margin-left: 9px;
  padding: 5px;
  padding-left: 26px;
  border-bottom: 1px solid #dfdfdf;
  background-color: rgba(255, 255, 255, 0);
}

#button1_send {
  position: absolute;
  left: 225px;
  top: 155px;
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
  height: 50px;
  border-radius: 25px;
  background-color: #ff9801;
  color: #ffffff;
  border: 0px;
  font-size: 20px;
  cursor: pointer;
}

#center_button2 {
  margin-top: 29px;
  text-align: center;
}
</style>
