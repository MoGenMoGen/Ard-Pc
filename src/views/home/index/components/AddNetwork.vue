<template>
  <div class="add-address">
    <div class="center">
      <div class="center-div">
        <p>网点信息：</p>
        <el-input type="text" placeholder="请输入网点信息" v-model="form.name"></el-input>
      </div>
      <div class="footer">
        <button @click="submit">保存</button>
        <button class="button2" @click="back">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
let id = 1;
export default {
  name: "addNetwork",
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      title: "添加收货地址",
      addr: [],
      id: "",
      type: "",

      addrList: [],

      props: {
        label: "name",
        value: "code"
      }
    };
  },
  methods: {
    //获取省市区数据
    back() {
      this.$emit("cancalShow");
    },
    submit() {
      this.$emit("saveNetwork", this.form);
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*最外层布局*/
/*中间那一块*/

.el-cascader {
  width: 260px;
}
.center {
  margin-left: 33px;
  display: flex;
  display: -webkit-flex;
  flex-flow: column wrap;
  > div {
    &:nth-last-of-type(2) {
      align-items: flex-start;
    }
  }
  .center-div {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 10px 0;
    p {
      width: 120px;
      font-size: 18px;
      color: #666;
    }
    .el-input {
      width: 260px;
    }
  }
}
/*中间那一块里面的div*/

/*中间那一块的表单*/

.select1 {
  float: left;
  width: 286px;
}
textarea {
  resize: none;
  width: 300px;
  height: 110px;
  padding: 22px;
  border: 1px solid #e1e1e1;
}

/*底部*/
.footer {
  margin: 40px 0 40px 120px;
}

/*底部按钮*/
.footer button {
  width: 130px;
  height: 50px;
  border: 1px solid #f6a33e;
  text-align: center;
  color: #f6a33e;
  background: white;
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
