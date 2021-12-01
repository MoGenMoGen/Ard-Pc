<template>
  <!--意见反馈-->
  <div class="outer">
    <div class="top">
      意见反馈:

    </div>
    <div class="center">
      <textarea placeholder="请输入您的宝贵意见，我们将会努力改进！" v-model="content">

      </textarea>
     <div class="footer">
       <button @click="submit1">确认</button>
       <button class="button2" @click="back">取消</button>
     </div>
    </div>


  </div>
</template>

<script>
    export default {
        name: "feedback",
        data(){
            return{
                content:''
            }
        },
        methods:{
            back:function () {
                this.$router.push('/service/personal');
            },
            async submit1() {
                if(this.content==''){
                    this.$message.error("反馈内容不能为空");
                }else{
                    let userInfo=JSON.parse(this.until.loGet('userInfo'));
                    let param = {
                        userId:userInfo.userId,
                        userName: userInfo.username,
                        content: this.content
                    };

                    let res = await this.api.postFeedback(param);
                    console.log(res);
                    if(res.code=='0'){
                        this.$message(
                            {message:"信息提交成功",
                            type:"success"}
                        );
                    }else {
                        this.$message.error(res.msg);
                    }

                }

            }
        }
    }
</script>

<style scoped>

  /*最外层布局*/
  .outer{
    padding-top: 14px;
    min-height: 550px;
    width:950px;
    background: white;
  }
  .top{
    margin-left: 35px;
    color: #666666;
    font-size: 18px;
    margin-top: 20px;
  }
  .center{
    margin-left: 35px;
    margin-top: 18px;
  }
  textarea{
    padding-top: 15px;
    padding-left: 21px;
    color: #999999;
    font-size: 14px;
    width: 556px;
    height: 320px;
    border: 1px solid #DFDFDF;
    display: block;
    resize: none;
  }

  .footer{
    margin-top: 40px;
  }
  /*底部按钮*/
  .footer button{
    width: 140px;
    height: 50px;
    border: 1px solid #F6A33E;
    text-align: center;
    color: #F6A33E;
    background: white;
    border-radius: 3px;
    cursor: pointer;


  }
  /*底部按钮鼠标经过的样式*/
  .footer button:hover{
    background: #F6A33E;
    color:#FFFFFF
  }
  /*第二个按钮*/
  .button2{
    margin-left: 25px;
  }

</style>
