<template>
  <div class="add-address">
    <div class="center">
      <div class="center-div">
        <p>收货人：</p>
        <el-input type="text" placeholder="请输入收货人姓名" v-model="form.linkMan"></el-input>
      </div>
      <div class="center-div">
        <p>联系电话：</p>
        <el-input type="text" placeholder="请输入联系电话" v-model="form.linkPhone"></el-input>
      </div>
      <div class="center-div">
        <p>省市区：</p>
        <el-cascader
          :options="addrList"
          :props="props"
          v-model="addr"
          clearable
          @change="addrChange"
          ref="myCascader"
        ></el-cascader>
      </div>
      <div class="center-div">
        <p>营业网点：</p>
        <el-select v-model="form.networkId" filterable  clearable >
          <el-option
            v-for="item in networkList"
            :key="item.crmNetworkVo.id"
            :label="item.crmNetworkVo.name"
            :value="item.crmNetworkVo.id">
          </el-option>
        </el-select>
      </div>
      <div class="center-div">
        <p>详细地址：</p>
        <textarea placeholder="请输入详细地址，到门牌号码" v-model="form.address" maxlength="100"></textarea>
      </div>
      <div class="footer">
        <button @click="submit">保存</button>
        <button class="button2" @click="back">取消</button>
      </div>
      <div class="center-div" v-if="form.receiver">
        <p>现收货人：</p>
        <p style="width: auto">{{form.receiver}}</p>
      </div>
      <div class="center-div" v-if="form.receiver">
        <p>现联系电话：</p>
        <p style="width: auto">{{form.receiverPhone}}</p>
      </div>
      <div class="center-div" v-if="form.receiver">
        <p>现收货地址：</p>
        <p style="width: auto">{{form.receiveAddress}}</p>
      </div>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
let id = 1;
export default {
  name: "addAddress",
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      networkList: [],
      receiver: "",
      receiverPhone: "",
      receiveAddress: "",
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
  watch: {
    "form.areaCode": function(e) {
      this.addr = e && e.split("/");
    }
  },
  mounted() {
    this.getAddr();
    this.getNetwork();
  },
  methods: {
    //获取省市区数据
    async getAddr() {
      let param = {
        // pid:0
      };
      let res = await this.api.getAddr(param);
      this.addrList = res.data.list;
    },
    async getNetwork() {
      let res = await this.api.getNetworkList();
      this.networkList = res.data;
    },
    back() {
      this.$emit("cancalShow");
    },
    //省市区选择
    addrChange(e) {
      this.form.areaCode = e.join("/");
      this.form.areaName = this.$refs.myCascader
        .getCheckedNodes()[0]
        .pathLabels.join("/");
    },
    submit() {
      if((!this.addr) || this.addr.length == 0){
        this.$message.error("请选择省市区");
        return;
      }
      this.$emit("saveAddress", this.form);
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
