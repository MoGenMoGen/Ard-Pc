<template>
  <!--营业网点-->
  <div class="outer">
    <div class="top">
      <p class="title">营业网点</p>
      <button @click="addNetwork">添加营业网点</button>
      <button v-if="type==='order'" @click="backOrder">返回下单</button>
    </div>
    <ul>
      <li v-for="msg in msgList" :key="msg.crmNetworkVo.id">
        <div class="container">
          <div class="information">
            <div>
              <p class="people">网点信息：{{msg.crmNetworkVo.name}}</p>
            </div>
          </div>
          <div class="button1">
            <button class="edit1" @click="editNetwork(msg.crmNetworkVo.id)">编辑</button>
            <button class="delete1" @click="toDelet(msg.crmNetworkVo.id)">删除</button>
          </div>
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
    <el-dialog
      title="新增网点信息"
      :visible.sync="editOrderVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <add-network @cancalShow="closeAdd" @saveNetwork="submit" :form="form"></add-network>
    </el-dialog>
  </div>
</template>

<script>
import AddNetwork from "../components/AddNetwork";
export default {
  name: "address1",
  data() {
    return {
      msgList: [],
      pageNum: 1,
      total: 0,
      pageSize: 10,
      type: "",
      editOrderVisible: false,
      userInfo: {},
      form: {},
      addrList: [],
      addr: "",
      props: {
        label: "name",
        value: "code"
      }
    };
  },
  methods: {
    closeAdd() {
      this.editOrderVisible = false;
    },
    toDelet(id) {
      this.api.networkDelet(id).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        this.msgList = [];
        this.getnetworkList();
      });
    },
    editNetwork(id) {
      this.editOrderVisible = true;
      this.getNetwork(id);
    },
    addNetwork() {
      // const type = this.type ? this.type : "";
      // this.$router.push(`/service/addaddress?type=${type}`);
      this.editOrderVisible = true;
      this.form = {
        name: "",
      };
    },
    backOrder() {
      this.$router.push("/highcustom/order");
    },
    //点击处理当前页,定义的时候没有参数，调用的时候回自动加一个e
    async handleCurrentChange(e) {
      this.pageNum = e;
      let userInfo = JSON.parse(this.until.loGet("userInfo"));
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      let res = await this.api.getNetwork(param)
      this.msgList = res.data.records;
      this.total = res.data.total;
    },
    async handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      let userInfo = JSON.parse(this.until.loGet("userInfo"));
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      let res = await this.api.getNetwork(param);
      this.msgList = res.data.records;
      this.total = res.data.total;
      console.log(`每页 ${val} 条`);
    },
    //获取网点信息
    async getNetwork(id) {
      this.form = await this.api.getSysNetwork(id);
    },
    //省市区选择
    addrChange(e) {
      this.form.areaCode = e.join("/");
      this.form.areaName = this.$refs.myCascader
        .getCheckedNodes()[0]
        .pathLabels.join("/");
      // console.log(this.$refs.myCascader.getCheckedNodes()[0].pathLabels)
    },
    submit(form) {
      this.form = { ...form };
      if (this.until.isEmptyObject(this.form.name)) {
        this.$message.error("网点信息不能为空");
        return;
      }
      delete this.form.crtTm;
      delete this.form.crtBy;
      delete this.form.updTm;
      delete this.form.updBy;
      this.form.userId = this.userInfo.userId;
      this.form.userName = this.userInfo.username
      if(this.form.id==null){
        this.until.postData("/crm/network/api/add",JSON.stringify(this.form)).then(res => {
          if (res.code == 0) {
            this.msgList = [];
            this.getnetworkList();
            this.$message({
              message: "营业网点信息保存成功",
              type: "success"
            });
            this.editOrderVisible = false;
          }
        });
      }else{
        this.until.postData("/crm/network/api/upd",JSON.stringify(this.form)).then(res => {
          if (res.code == 0) {
            this.msgList = [];
            this.getnetworkList();
            this.$message({
              message: "营业网点信息修改成功",
              type: "success"
            });
            this.editOrderVisible = false;
          }
        });
      }
    },
    async getnetworkList() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      let res = await this.api.getNetwork(param);
      this.msgList.push(...res.data.records);
      this.total = res.data.total;
    }
  },
  mounted() {

    this.type = this.$route.query.type;
    this.userInfo = JSON.parse(this.until.loGet("userInfo"));
    this.getnetworkList();
  },
  components: {
    AddNetwork
  }
};
</script>

<style lang="less">
.el-dialog__body {
  padding: 0 20px;
}
</style>

<style scoped lang="less">
/*最外层布局*/
.outer {
  padding-top: 14px;
  min-height: 700px;
  width: 950px;
  background: white;
}
.top {
  padding-left: 35px;
  width: 914px;
  height: 70px;
  border-bottom: 1px solid #e1e1e1;
}
p.title {
  margin-top: 20px;
  color: #333333;
  font-size: 18px;
  float: left;
}
.top button {
  float: right;
  margin-right: 30px;
  margin-top: 5px;
  width: 149px;
  height: 37px;
  text-align: center;
  line-height: 37px;
  background: #ff9801;
  color: white;
}

.container {
  padding-top: 25px;
  padding-left: 35px;
  width: 914px;
  height: 85px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  display: -webkit-flex;
  flex-flow: row nowrap;
}
.container:hover {
  background: whitesmoke;
}
.information {
  flex: 1;
  margin-right: 4%;
}
/*删除和编辑按钮的布局*/
.button1 {
  margin-top: 10px;
  margin-right: 30px;
  display: flex;
  display: -webkit-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  button {
    cursor: pointer;
    background: white;
    border-radius: 3px;
  }
}
/*编辑按钮*/
.edit1 {
  margin-right: 41px;
  width: 96px;
  height: 36px;
  border: 1px solid #f6a33e;
  color: #f6a33e;
  font-size: 14px;
  line-height: 36px;
}
/*删除按钮和编辑按钮共同属性*/
.delete1 {
  width: 96px;
  height: 36px;
  border: 1px solid #f6a33e;
  color: #f6a33e;
  font-size: 14px;
  line-height: 36px;
}
/*在两个按钮的容器上设置hover有效果*/
.button1 :hover {
  background: #f6a33e;
  color: white;
}

p.people {
  display: inline-block;
}
p.phone {
  display: inline-block;
  margin-left: 80px;
}
.people,
.address1,
.phone {
  color: #666666;
  font-size: 14px;
  padding-bottom: 4px;
}
.address1 {
  margin-top: 12px;
}
.footer1 {
  margin-top: 30px;
  padding-left: 35px;
  width: 914px;
  height: 75px;
}
</style>
