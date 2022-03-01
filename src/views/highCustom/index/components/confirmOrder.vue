<template>
  <div class="order" v-loading="loading">
    <div class="title">
      <span @click="toIndex">首页 ></span>
      <!--<span @click="toHighCustomize">高端定制 ></span>-->
      <!--<span @click="toCart">购物车 ></span>-->
      <span>确认订单</span>
    </div>
    <div class="order-content">
      <div class="order-info">订单类型</div>
      <div class="order-type">
        <div>
          <div style="width: 66%">
            <span>下单对象：</span>
            <div class="choose-man-cont">
              <el-radio-group v-model="order.buyType" @change="changeRadio">
                <el-radio :label="1">自己</el-radio>
                <el-radio :label="2" v-show="showAgent">
                  <el-select v-model="order.agentId" placeholder="请选择" @change="changeBuyer" filterable>
                    <el-option v-for="item in saleList" :key="item.id" :label="item.corpName + '(' + item.code + ')'"
                      :value="item.id"></el-option>
                  </el-select>
                </el-radio>
              </el-radio-group>
              <el-input v-show="showShortTime" v-model="order.shortTimeName" placeholder="请输入临时客户名称"></el-input>

              <div style="margin-left: 50px; display: -webkit-box">
                <span>营业网点：</span>
                <el-select placeholder="请选择" v-model="networkId" @change="netWorkCH" clearable filterable>
                  <el-option v-for="item in networkList" :key="item.crmNetworkVo.id" :label="
                      item.crmNetworkVo.name + '(' + item.networkType + ')'
                    " :value="item.crmNetworkVo.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>期望交期：</span>
            <el-date-picker v-model="order.delieryTime" type="date" placeholder="选择日期" :picker-options="pickerOptions">>
            </el-date-picker>
          </div>
          <div>
            <span>订单类型：</span>
            <el-select v-model="order.orderType" placeholder="请选择" @change="changeOrderType">
              <el-option v-for="item in orderTypeList" :key="item.id" :label="item.nm" :value="item.cd"></el-option>
            </el-select>
          </div>
          <div v-show="showProject">
            <span>项目报备：</span>
            <el-select v-model="order.reportName" placeholder="请选择" @focus="dialogShow = true"></el-select>
          </div>

          <div v-show="this.order.orderType == 11">
            <span>关联订单：</span>
            <el-select placeholder="请选择" v-model="order.bhId" clearable filterable>
              <el-option v-for="item in bhOrderList" :key="item.id" :label="item.orderCode" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>

        <div>
          <div>
            <span>logo数量：</span>
            <el-select v-model="order.logoNum" placeholder="请选择">
              <el-option v-for="item in orderNumList" :key="item.id" :label="item.nm" :value="item.cd"></el-option>
            </el-select>
          </div>
          <!--<div>
            <span>物流费用：</span>
            <div class="logistics-fee-cont">
              <el-radio-group v-model="order.payLogisticsFeeType">
                <el-radio label="1">到付</el-radio>
                <el-radio label="2">月结</el-radio>
                <el-radio label="3">平台垫付</el-radio>
              </el-radio-group>
            </div>
          </div>-->

          <div>
            <span>快递类型：</span>
            <div class="logistics-fee-cont">
              <el-select v-model="order.expressType" filterable placeholder="请选择">
                <el-option v-for="item in expressTypeList" :key="item.id" :label="item.nm" :value="item.cd"></el-option>
              </el-select>
            </div>
          </div>
          <!-- <div>
            <span>logo数量：</span>
            <el-input min="0" v-model="order.logoNum" type="number"></el-input>
          </div>-->
        </div>
      </div>

      <div class="choose-address">
        <p>选择收货地址</p>
        <button @click="toCenterAddress">管理收货地址</button>
      </div>
      <div class="choose-address-cont">
        <address-manage @changeAddr="changeAddrPicker" :addressList="addressList" :addrPk="addrPicker"
          @saveOrderInfo="saveOrderInfo" @chFilter="chFilter"></address-manage>
      </div>

      <!--<div class="choose-address">
        <p>选择营业网点</p>
        <button @click="toCenterNetwork">管理营业网点</button>
      </div>
      <div class="choose-address-cont">
        <network-manage
          @changeNetwork="changeNetworkPicker"
          :networkList="networkList"
          :networkPicker="networkPicker"
        ></network-manage>
      </div>-->

      <div class="confirm-order" v-if="!id">
        <span>确认订单信息</span>
        <i>注： 待订单评审通过后会核算订单价格，请注意查看订单状态。</i>
      </div>
      <div class="cart-table" v-if="!id">
        <!-- 列名 -->
        <div class="table-title">
          <div>序号</div>
          <div>产品名称</div>
          <div>定制属性规格</div>
          <!-- <div>异型文件</div> -->
          <div>数量</div>
          <div>备注（安装位置/开或不开）</div>
          <div>备注（项目名称）</div>
          <div>备注（其它产品信息）</div>
        </div>
        <!-- 购物车内容 -->
        <div class="table-item" v-for="(item, index) in cartList" :key="index">
          <div>{{ index + 1 }}</div>
          <div v-if="item.specName">
            {{ item.productName + "(" + item.specName + ")" }}
          </div>
          <div v-else>{{ item.productName }}</div>
          <div>{{ item.productAttr }}</div>
          <!-- <div>{{item.shapeImgUrl}}</div> -->
          <div>{{ item.buyNum }}</div>
          <div>
            <textarea v-model="item.installSite" maxlength="50" @blur="checkXML(1, item, 'installSite')"></textarea>
          </div>
          <div>
            <textarea v-model="item.remark" maxlength="50" @blur="checkXML(1, item, 'remark')"></textarea>
          </div>
          <div>
            <textarea v-model="item.remarkProduct" maxlength="50" @blur="checkXML(1, item, 'remarkProduct')"></textarea>
          </div>
          <a href="javascript:;" v-if="item.shapeImgUrl != null && item.shapeImgUrl != ''" target="_blank"
            v-for="(item2, index) in (item.shapeImgUrl || '').split(',')" :key="index"
            @click="openFile(item2)">附件{{ index + 1 }}</a>
        </div>
      </div>
      <div class="note">
        <span>备注</span>
        <textarea v-model="order.remark" maxlength="100" @blur="checkXML(2)"></textarea>
      </div>
      <div class="integral" v-show="userInfo.userType == 2">
        <span style="margin-right: 16px">积分:</span>
        <span class="blue" style="margin-right: 40px">网点积分：{{ networkScore }}</span>
        <span class="blue">经销商积分：{{ agentScore }}</span>
      </div>
    </div>
    <div class="order-footer">
      <div class="checked-all">
        <!--<div>-->
        <!--<svg class="icon" aria-hidden="true">-->
        <!--<use xlink:href="#iconfanhui" />-->
        <!--</svg>-->
        <!--<button>返回</button>-->
        <!--</div>-->
        <!--<div>购物车修改</div>-->
      </div>
      <div class="btn">
        <button @click="saveOrder">提交订单</button>
      </div>
    </div>
    <el-dialog width="70%" :visible.sync="dialogShow" @close="closeDialog" :close-on-click-modal="false">
      <div class="dialog-title">项目报备</div>
      <!-- 搜索条件 -->
      <div class="selector">
        <div>
          <span>所在区域：</span>
          <el-cascader :options="regions" :props="{ checkStrictly: true, value: 'code', label: 'name' }"
            v-model="proParam.projectAreaCode" @change="changeAddr" clearable ref="myCascader"></el-cascader>
        </div>
        <div>
          <span>经销商名称：</span>
          <el-select v-model="proParam.saleId" placeholder="请选择" @change="changeSale" filterable>
            <el-option v-for="item in saleList" :key="item.id" :label="item.corpName" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="selector">
        <div>
          <span>报备状态：</span>
          <el-select v-model="proParam.queryType" placeholder="请选择" @change="queryTypeChangeSale" filterable>
            <el-option v-for="item in queryTypeList" :key="item.cd" :label="item.nm" :value="item.cd"></el-option>
          </el-select>
        </div>
        <div>
          <span>项目负责人：</span>
          <el-input v-model="proParam.projectLeader" @blur="changeLeader"></el-input>
        </div>

        <div>
          <span>工程名称：</span>
          <el-input v-model="proParam.projectName" @blur="changeLeader"></el-input>
        </div>
      </div>
      <project-list :projectList="proList"></project-list>
      <!-- 分页 -->
      <el-pagination @current-change="changePageNum" :current-page="proParam.pageNum" :page-size="proParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :page-sizes="[2]" :total="projectTotal"></el-pagination>
      <!-- 操作 -->
      <div class="opreate-dialog">
        <div>
          <button @click="closeDialog">取消</button>
        </div>
        <div>
          <button @click="confirmDialog">确认</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="新增收货地址" :visible.sync="editOrderVisible" width="50%" :close-on-click-modal="false">
      <add-address @cancalShow="closeAdd" @saveAddress="submit" :form="form"></add-address>
    </el-dialog>
    <!--<el-dialog
      title="新增营业网点"
      :visible.sync="addNetworkVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <add-network @cancalShow="closeNetWork" @saveNetwork="submitNetwork" :form="form2"></add-network>
    </el-dialog>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import addressManage from "@/components/addressManage";
  import networkManage from "@/components/networkManage";
  import AddAddress from "../../../home/index/components/AddAddress";
  import projectList from "./projectList";
  import AddNetwork from "../../../home/index/components/AddNetwork";

  export default {
    data() {
      return {
        maxDate: '',
        networkScore: "", //网点积分
        agentScore: "", //经销商总积分
        netList: [], //网点信息列表
        bhOrderList: [],
        loading: false,
        filtValue: {
          name: "",
          tel: "",
        },
        networkId: "",
        id: "",
        queryTypeList: [{
            cd: 3,
            nm: "未完结"
          },
          {
            cd: 7,
            nm: "全部"
          },
        ],
        networkList: [],
        networkPicker: "",
        addNetworkVisible: false,
        expressTypeList: [],
        form: {},
        form2: {},
        checkAddrId: "",
        projectTotal: 0,
        dialogShow: false,
        regions: [],
        showProject: false,
        addrPicker: "",
        immedOrder: false,
        showLogo: false,
        showShortTime: false,
        isLogo: "",
        orderTypeList: [],
        orderTypeList1: [],
        editOrderVisible: false,
        product: {
          productCatCode: "",
          productFunCode: "",
        },
        proList: [],
        saleList: [],
        addressList: [],
        originList: [],
        networkoriginList: [],
        orderNumList: [],
        order: {
          expressType: "",
          buyId: "",
          agentName: "",
          buyType: "",
          orderType: "",
          orderAreaCode: "",
          orderAreaName: "",
          delieryTime: "",
          receiver: "",
          receiveAddress: "",
          receiverPhone: "",
          remark: "",
          itemList: [],
          reportName: "",
          reportId: "",
          payLogisticsFeeType: "",
          logoNum: "1",
          agentId: "",
          shortTimeName: "",
          networkId: "",
          networkName: "",
          bhId: "",
        },
        cartList: [],
        userInfo: {},
        proParam: {
          pageSize: 2,
          pageNum: 1,
          userId: "",
          userType: "",
          isShare: 0,
          queryType: 3,
          saleId: "",
          projectLeader: "",
          projectAreaCode: "", //省市区编码
          projectName: "",
        },
        text: [], //禁止符号
        form: {
          userId: "",
          extUserIds: "",
          saleType: "",
          queryType: 1,
        },
        ids: "",

        forbidden: [],
      };
    },
    watch: {
      "order.payLogisticsFeeType": function(e) {
        console.log(e);
      },
    },
    computed: {
      showAgent() {
        return !(this.userInfo.saleType === 1 || this.userInfo.saleType === 3);
      },
      pickerOptions() {
        let that = this;
		return {
			  disabledDate(time) {
          if (that.maxDate) {
            return time.getTime() < Date.now() + 3600 * 1000 * 24 * (that.maxDate-1);
          } else {
            return time.getTime() < Date.now() + 3600 * 1000 * 24 * 6;
          }
        },
		}
      
      },

    },
    async mounted() {
      this.order.delieryTime = Date.now() + 3600 * 1000 * 24 * 7;
      console.log(JSON.parse(this.until.loGet("cartList")));
      this.userInfo = JSON.parse(this.until.loGet("userInfo"));
      this.id = this.$route.query.id ? this.$route.query.id : "";
      this.ids = this.$route.query.ids;
      if (this.ids) {
        this.getCartList();
      } else {
        this.cartList = JSON.parse(this.until.loGet("cartList"));
      }
      this.until.loRemove("cartList");
      if (this.userInfo) {
        this.order.agentName = this.userInfo.corpName;
        this.order.agentCode = this.userInfo.agentInfoCode;
        this.order.orderAreaName = this.userInfo.regionName;
        this.order.orderAreaCode = this.userInfo.regionCode;
        await this.getPersonalAddress();
        await this.getPersonalNetwork();
      }
      if (this.userInfo.userType == 2) {
        let info1 = await this.api.getOneAllPoints({
          agentId: this.userInfo.agentInfoId,
        });
        let info2 = await this.api.getNetWorkScoreList({
          pageNo: 1,
          pageSize: 100,
          userId: this.userInfo.userId,
          name: "",
        });

        this.agentScore = info1.availablePoints; //经销商可用积分
        this.netList = info2.data.records; //网点列表信息
        // console.log("ffff", this.netList);
        this.order.buyType=1;
      }
      if (this.checkAddrId) {
        await this.getProxyAddressList();
      }
      await this.getSaleNameList();
      await this.getRegionList();
      await this.getBasicData();
      await this.getOrderTypeList();
      await this.getExpressTypeList();
      //await this.getBhOrderList();
      if (this.until.seGet("orderInfo")) {
        let orderInfo = JSON.parse(this.until.seGet("orderInfo"));
        for (let [k, v] of Object.entries(orderInfo)) {
          this[k] = v;
        }
        this.until.seRemove("orderInfo");
      }
      this.getForbidden();
    },
    methods: {
      //验证所输入的内容是否包含禁止符号
      checkXML(type, item, index) {
        if (type == 1) {
          //列表
          if (item[index]) {
            let i = this.forbidden.findIndex((v) => {
              return item[index].indexOf(v.nm) > -1;
            });
            if (i > -1) {
              this.$alert(
                this.text.join(",") +
                "输入框中含有这些禁止符号，请去掉所有禁止符号",
                "", {
                  confirmButtonText: "确定",
                  callback: () => {
                    console.log();
                    this.forbidden.forEach((v) => {
                      if (item[index].indexOf(v.nm) > -1) {
                        item[index] = item[index].replace(RegExp(v.nm, "g"), "");
                      }
                    });
                  },
                }
              );
            }
          }
        } else {
          if (this.order.remark) {
            let i = this.forbidden.findIndex((v) => {
              return this.order.remark.indexOf(v.nm) > -1;
            });
            if (i > -1) {
              this.$alert(
                this.text.join(",") +
                "输入框中含有这些禁止符号，请去掉所有禁止符号",
                "", {
                  confirmButtonText: "确定",
                  callback: () => {
                    console.log();
                    this.forbidden.forEach((v) => {
                      if (this.order.remark.indexOf(v.nm) > -1) {
                        this.order.remark = this.order.remark.replace(
                          RegExp(v.nm, "g"),
                          ""
                        );
                      }
                    });
                  },
                }
              );
            }
          }
        }
      },
      saveOrderInfo() {
        let data = {};
        data.proParam = this.proParam;
        data.proList = this.proList;
        data.projectTotal = this.projectTotal;
        data.showProject = this.showProject;
        data.showLogo = this.showLogo;
        data.checkAddrId = this.checkAddrId;
        data.addrPicker = this.addrPicker;
        data.order = this.order;
        data.isLogo = this.isLogo;
        this.until.seSave("orderInfo", JSON.stringify(data));
        this.until.loSave("cartList", JSON.stringify(this.cartList));
      },
      chFilter(filter) {
        this.filtValue.name = filter.name;
        this.filtValue.tel = filter.tel;
        if (this.userInfo) {
          this.getPersonalAddress();
        }
        if (this.checkAddrId) {
          this.getProxyAddressList();
        }
      },
      async getCartList() {
        this.cartList = await this.api.getCartListByBatch({
          ids: this.ids
        });
        this.cartList.map((item) => {
          const arr = [];
          item.productAttributes &&
            item.productAttributes.map((itemChild) => {
              arr.push(itemChild.attributeValueName);
            });
          item.productAttr = arr.join(" ");
        });
      },
      toIndex() {
        this.$router.push("/");
      },
      toHighCustomize() {
        this.$router.push("./customize");
      },
      toCart() {
        this.$router.push("./cart");
      },
      closeDialog() {
        this.dialogShow = false;
      },
      confirmDialog() {
        this.dialogShow = false;
        //得到相关单位,当orderType为项目的时候，以下值必填
        let filter = this.proList.filter((item) => item.checked);
        this.order.reportName = filter[0].projectName;
        this.order.reportId = filter[0].id;
      },
      closeAdd() {
        this.editOrderVisible = false;
      },
      closeNetWork() {
        this.addNetworkVisible = false;
      },
      submit(form) {
        console.log("新增地址", this.form);
        this.form = {
          ...form
        };
        let msg = this.reg.checkPhone(this.form.linkPhone);
        if (msg !== "ok") {
          this.$message.error(msg);
          return;
        }
        this.form.addressType = "临时地址";
        console.log(this.form);
        this.addressList.push(this.form);
        this.editOrderVisible = false;
        delete this.form.crtTm;
        delete this.form.crtBy;
        delete this.form.updTm;
        delete this.form.updBy;
        this.form.userId = this.userInfo.userId;
        /*this.api.addrAdd(this.form).then(res => {
            if (res.code == 0) {
              this.getPersonalAddress();
              this.$message({
                message: "地址保存成功",
                type: "success"
              });
              this.editOrderVisible = false;
            }
          });*/
      },
      submitNetwork(form) {
        this.form2 = {
          ...form
        };
        if (this.until.isEmptyObject(this.form2.name)) {
          this.$message.error("不能为空");
          return;
        }

        delete this.form2.crtTm;
        delete this.form2.crtBy;
        delete this.form2.updTm;
        delete this.form2.updBy;
        this.form2.userId = this.userInfo.userId;
        this.form2.userName = this.userInfo.realName;
        this.until
          .postData("/crm/network/api/add", JSON.stringify(this.form2))
          .then((res) => {
            if (res.code == 0) {
              this.msgList = [];
              this.getPersonalNetwork();
              this.$message({
                message: "营业网点信息保存成功",
                type: "success",
              });
              this.addNetworkVisible = false;
            }
          });
      },
      changeRadio(e) {
        this.order.orderType = "";
        this.orderTypeList = this.orderTypeList1;
        this.showProject = false;
        this.orderTypeList = this.orderTypeList1.filter(
          (item) => item.arg2 && item.arg2.trim() == "public"
        );
        if (e == 1) {
          //当agentInfoId为空的时候，不能选择自己下单
          if (!this.userInfo.agentInfoId) {
            this.order.buyType = "";
            this.$message.error("非经销商用户不能选择为自己下单！");
            return;
          }

          this.order.agentId = "";
          this.order.agentCode = this.userInfo.agentInfoCode;
          this.getPersonalAddress();

          this.api.getAgentOrdrType(this.userInfo.agentInfoId).then((res) => {
            if (res.code === 0) {
              if (res.data.orderType) {
                var gl = res.data.orderType.split(",");
                this.orderTypeList = this.orderTypeList1.filter(
                  (item) =>
                  gl.indexOf(item.cd) != -1 ||
                  (item.arg2 && item.arg2.trim() == "public")
                );
              } else {
                this.orderTypeList = this.orderTypeList1.filter(
                  (item) => item.arg2 && item.arg2.trim() == "public"
                );
              }
            }
          });
        } else {
          if (this.order.agentId) {
            let filter = this.saleList.filter(
              (item) => item.id === this.order.agentId
            );
            this.checkAddrId = filter[0].id;
            this.getProxyAddressList();
          }

          if (this.saleList.length === 0) {
            if (this.userInfo.userType === 2) {
              this.$message.error("当前用户只能为自己下单！");
              return;
            } else {
              this.$message.error("当前用户没有可供选择的经销商下单！");
              return;
            }
          }
        }
      },
      toCenterAddress() {
        // this.saveOrderInfo();
        // this.$router.push("/service/myaddress?type=order");
        this.editOrderVisible = true;
        this.form = {
          areaCode: "", //所在区划编码
          areaName: "", //所在区划名称
          linkMan: "", //收货联系人
          linkPhone: "", //收货联系人电话
          isDefault: "1", //是否默认
          address: "", //详细地址
          userId: "",
        };
      },
      toCenterNetwork() {
        // this.saveOrderInfo();
        // this.$router.push("/service/myaddress?type=order");
        this.addNetworkVisible = true;
        this.form2 = {
          id: "",
          name: "",
        };
      },
      changeAddr(e) {
        this.proParam.projectAreaCode = e.join("/");
        // console.log(this.proParam.projectAreaCode);
        this.proList = [];
        this.proParam.pageNum = 1;
        this.getProjectList();
      },
      async changeSale() {
        this.proList = [];
        this.proParam.pageNum = 1;
        await this.getProjectList();
        //变更对应的收货地址
      },
      async queryTypeChangeSale(value) {
        this.proParam.queryType = value;
        let data = await this.api.getSysProjectList(this.proParam);
        this.projectTotal = data.total;
        data.result.map((item) => {
          item.checked = false;
          item.reportTime = item.reportTime.substring(0, 10);
        });
        this.proList = data.result;
      },
      changeBuyer() {
        //
        // debugger;
        this.order.buyType = 2;
        let filter = this.saleList.filter(
          (item) => item.id === this.order.agentId
        );
        this.order.agentId = filter[0].id;
        this.order.agentName = filter[0].corpName;
        this.order.agentCode = filter[0].code;
        this.order.orderAreaName = filter[0].regionName;
        this.order.orderAreaCode = filter[0].regionCode;
        if (filter[0].orderType) {
          this.order.orderType = "";
          if (filter[0].orderType == 4 || filter[0].orderType == 5) {
            this.showProject = true;
            this.getProjectList();
          } else {
            this.showProject = false;
          }
          var gl = filter[0].orderType.split(",");
          this.orderTypeList = this.orderTypeList1.filter(
            (item) =>
            gl.indexOf(item.cd) != -1 ||
            (item.arg2 && item.arg2.trim() == "public")
          );
        } else {
          this.orderTypeList = this.orderTypeList1.filter(
            (item) => item.arg2 && item.arg2.trim() == "public"
          );
          this.order.orderType = "";
          this.showProject = false;
        }
        this.checkAddrId = filter[0].id;
        let shortTimeBool = filter[0].isShortTime;
        if (shortTimeBool) {
          this.order.isShortTime = shortTimeBool;
          this.order.shortTimeName = filter[0].shortTimeName ?
            filter[0].shortTimeName :
            "";
          this.showShortTime = true;
        } else {
          this.order.shortTimeName = "";
          this.order.isShortTime = 0;
          this.showShortTime = false;
        }
        console.log(this.order.isShortTime);
        this.getProxyAddressList();
        this.getProxyNetworkList(filter[0].code);
      },
      changeLeader() {
        this.proList = [];
        this.getProjectList();
      },
      changePageNum(e) {
        this.proParam.pageNum = e;
        this.getProjectList();
      },
	  
      changeOrderType(e) {
        //项目的时候
		let a=this.orderTypeList.findIndex((item)=>{
			return item.cd==e
		})
        if (this.orderTypeList[a].arg5) {
          this.maxDate = this.orderTypeList[a].arg5
          this.order.delieryTime = Date.now() + 3600 * 1000 * 24 * this.orderTypeList[a].arg5
        }
        
        if (e == 4 || e == 5) {
          this.showProject = true;
          this.getProjectList();
        } else {
          this.showProject = false;
        }
        if (e == 11) {
          if (!this.order.buyType) {
            this.$message.error("请先选择下单对象");
            this.order.orderType = "";
            return;
          }
          this.getBhOrderList();
        } else {
          this.order.bhId = "";
        }
      },
      async getBhOrderList() {
        let userInfo1 = this.until.loGet("userInfo");
        if (userInfo1) {
          let userInfo = JSON.parse(userInfo1);
          if (userInfo.userType === 2) {
            var agentId = userInfo.agentInfoId;
          } else {
            var agentId = this.order.agentId;
            var buyId = userInfo.userId;
            var extUserIds = userInfo.extUserIds ? userInfo.extUserIds : "";
          }
        }
        this.param = {
          pageSize: 1000000, //每页显示的数据条数
          pageNum: 1, //第几页
          buyId: buyId, //用户账号编号
          agentId: agentId,
          extUserIds: extUserIds,
          // orderStartTime: this.orderStartTime, //下单开始时间
          // orderEndTime: this.orderEndTime, //下单结束时间
          // customType: this.customType, //1-定制 2-艺术定制 3-专属定制 0-标准
          // statusStr: this.status, //0-取消  100-199 为审核的状态
          // orderCode: this.orderCode, //erp返回过来的订单编号
          // orderType: this.orderType //订单类型
        };
        let data = await this.api.myOrderBH(this.param);
        if (data.code == 0) {
          this.bhOrderList = data.data.list;
        }
      },
      //营业网点改变的时候
      netWorkCH() {
        if (this.networkId != "") {
          let le = this.networkList.find(
            (value) => value.crmNetworkVo.id === this.networkId
          );
          this.order.networkId = le.crmNetworkVo.id;
          this.order.networkName = le.crmNetworkVo.name;
          if (this.userInfo) {
            this.getPersonalAddress();
          }
          if (this.checkAddrId) {
            this.getProxyAddressList();
          }
          this.netList.forEach((item) => {
            if (item.networkId == this.networkId) {
              this.networkScore = item.availablePoints; //网点可用积分
            }
          });
        } else {
          this.order.networkId = "";
          this.order.networkName = "";
          if (this.userInfo) {
            this.getPersonalAddress();
          }
          if (this.checkAddrId) {
            this.getProxyAddressList();
          }
        }
      },
      changeAddrPicker(item) {
        this.addrPicker = item.id;
        this.order.receiver = item.linkMan;
        this.order.receiverPhone = item.linkPhone;
        // this.order.orderAreaName = item.areaName
        this.order.receiveAddress = `${item.areaName}-${item.address}`;
        // console.log(item);
        // console.log(this.order);
      },
      changeNetworkPicker(item) {
        this.networkPicker = item.crmNetworkVo.id;
        this.order.networkId = item.crmNetworkVo.id;
        this.order.networkName = item.crmNetworkVo.name;
        // console.log(item);
        // console.log(this.order);
      },
      async getProjectList() {
        this.proParam.userId = this.userInfo.userId;
        if (this.order.buyType) {
          if (this.order.buyType === 1) {
            if (this.userInfo.agentInfoId) {
              this.proParam.saleId = this.userInfo.agentInfoId;
            }
          }
        }

        this.proParam.userType = this.userInfo.userType;
        let data = await this.api.getSysProjectList(this.proParam);
        this.projectTotal = data.total;
        data.result.map((item) => {
          item.checked = false;
          item.reportTime = item.reportTime.substring(0, 10);
        });
        this.proList = data.result;
      },
      //获取禁止符号
      async getForbidden() {
        this.forbidden = await this.api.getBaseDictionaryList(
          "XmlCanTUnderstandString"
        );
        this.text = [];
        this.forbidden.forEach((v) => {
          this.text.push(v.nm);
        });
      },
      async getBasicData() {
        this.orderNumList = await this.api.getBaseDictionaryList("orderLogoNum");
      },
      async getOrderTypeList() {
        // 请在数据字典订单类型的arg2 添加public值
        this.orderTypeList = await this.api.getBaseDictionaryList("orderType");
        this.orderTypeList1 = this.orderTypeList;
        this.orderTypeList = this.orderTypeList1.filter(
          (item) => item.arg2 && item.arg2.trim() == "public"
        );
      },
      async getExpressTypeList() {
        this.expressTypeList = await this.api.getBaseDictionaryList(
          "express_type"
        );
      },
      async getSaleNameList() {
        this.form.userId = this.userInfo.userId;
        this.form.extUserIds = this.userInfo.extUserIds;
        if (this.userInfo.userType === 1) {
          this.form.groupLeaderId = this.userInfo.userId;
        }
        if (this.userInfo.userType === 2) {
          this.form.groupLeaderId = this.userInfo.groupLeaderId;
        }
        if (
          this.userInfo.userType == 1 ||
          this.userInfo.userType == 3 ||
          this.userInfo.userType == 5
        ) {
          this.form.exceptType = true;
        } else {
          this.form.exceptType = false;
        }
        this.saleList = await this.api.getSysDistributorList(this.form);
      },
      async getRegionList() {
        let res = await this.api.getAddr();
        this.regions = res.data.list;
      },
      //自己地址
      async getPersonalAddress() {
        const param = {
          userId: this.userInfo.userId,
          networkId: this.networkId,
          nm: this.filtValue.name,
          tel: this.filtValue.tel,
          pageNum: 1,
          pageSize: 10000,
        };

        let list = await this.api.getAddressList(param);
        this.addressList = list;
        this.originList = list;
        this.addressList.map((item) => (item.addressType = "本人地址"));
      },
      //本人营业网点
      async getPersonalNetwork() {
        const param = {
          pageNum: 1,
          pageSize: 10000,
        };
        this.networkList = [];
        let list = await this.api.getNetwork(param);
        this.networkList.push(...list.data.records);
        this.networkoriginList = this.networkList;
        /*this.originList = list;*/
        this.networkList.map((item) => (item.networkType = "本人营业网点"));
      },
      openFile(url) {
        console.log(url);
        window.open(url);
      },
      //他人地址
      async getProxyAddressList() {
        const param = {
          agentId: this.checkAddrId,
          pageNum: 1,
          nm: this.filtValue.name,
          tel: this.filtValue.tel,
          networkId: this.networkId,
          pageSize: 10000,
        };

        let list = await this.api.getAddressList(param);

        if (list.length > 0) {
          list.map((item) => (item.addressType = "经销商地址"));
        }
        this.addressList = [...this.originList, ...list];
      },
      //他人营业网点
      async getProxyNetworkList(code) {
        const param = {
          agentId: this.checkAddrId,
          pageNum: 1,
          pageSize: 10000,
          agentCode: code,
        };

        let list = await this.api.getNetwork(param);
        var list2 = [];
        list2.push(...list.data.records);
        if (list2.length > 0) {
          list2.map((item) => (item.networkType = "他人营业网点"));
        }
        this.networkList = [...this.networkoriginList, ...list2];
      },
      async saveOrder() {
        if (this.order.delieryTime) {
          let {
            year,
            month,
            day
          } = this.until.formatDate(
            this.order.delieryTime
          );
          this.order.delieryTime = `${year}-${month}-${day}`;
        } else {
          this.order.delieryTime = "";
          this.$message.error("期望交货日期为空");
          return;
        }
        if (
          this.order.orderType == 11 ||
          this.order.orderType == "11" ||
          this.order.orderType == "11"
        ) {
          if (!this.order.bhId || this.order.bhId == "") {
            this.$message.error("补货订单类型必须要选择关联订单");
            return;
          }
        } else {
          this.order.bhId = "";
        }

        console.log(this.order.delieryTime);
        this.order.agentId = this.order.agentId ?
          this.order.agentId :
          this.userInfo.agentInfoId;
        this.order.buyId = this.userInfo.userId;

        let cartList = [],
          itemRemark = false,
          installSite = false;
        if (this.cartList && this.cartList.length > 0) {
          this.order.orderNum = this.cartList.reduce((p, n) => {
            return p + n.orderNum;
          }, 0);
          this.cartList.map((item, index) => {
            let cartObj = {};
            if (item.hasOwnProperty("id")) {
              this.immedOrder = false;
            } else {
              this.immedOrder = true;
            }
            cartObj = {
              sort: index + 1,
              id: item.id,
              buyNum: item.buyNum,
              remark: item.remark,
              installSite: item.installSite,
              remarkProduct: item.remarkProduct,
            };

            cartList.push(cartObj);

            if (!item.remark) {
              itemRemark = true;
            }

            if (!item.installSite) {
              installSite = true;
            }
          });
          //购物车提交订单不传itemList,传cartList,立即下单传itemList，通过buyId来区分
          if (this.immedOrder) {
            this.order.itemList = JSON.stringify(this.cartList);
          } else {
            this.order.cartList = JSON.stringify(cartList);
          }
        }

        if (!this.order.orderType) {
          this.$message.error("订单类型为必填");
          return;
        }
        if (!this.order.networkId || !this.order.networkName) {
          this.$message.error("营业网点为必填");
          return;
        }
        if (this.showProject && !this.order.reportName) {
          this.$message.error("项目报备为必填");
          return;
        }
        if (!this.order.delieryTime) {
          this.$message.error("期望交期为必填");
          return;
        }
        console.log(this.order.isShortTime);
        if (this.order.isShortTime && !this.order.shortTimeName) {
          this.$message.error("临时客户名称为必填");
          return;
        }
        if (!this.order.agentId) {
          this.$message.error("下单者必选");
          return;
        }
        /*if (!this.order.payLogisticsFeeType) {
            this.$message.error("物流费用为必填");
            return;
          }*/
        if (!this.order.receiver) {
          this.$message.error("收货地址为必选");
          return;
        }
        /** 2019年12月6日 肖工要求去掉备注必填判断 */
        // if (itemRemark) {
        //   this.$message.error("订单明细数据的备注（其它）为必填");
        //   return;
        // }
        if (this.order.logoNum === "") {
          this.$message.error("订单logo数量为必填");
          return;
        }
        // if (installSite) {
        //   this.$message.error("订单明细数据的备注（安装位置）为必填");
        //   return;
        // }
        // if (!this.order.remark) {
        //   this.$message.error("订单备注为必填");
        //   return;
        // }
        this.loading = true;
        // console.log('======================')
        // return
        if (this.id) {
          this.order.id = this.id;

          this.api.copyOrderComfirm(this.order).then((res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({
                message: "提交成功！",
                type: "success",
              });
              this.$router.push("/service/order");
              // setTimeout(() => {
              //
              // }, 1500);
            }
          });
        } else {
          if (
            !(
              (this.order.itemList && this.order.itemList.length > 0) ||
              (this.order.cartList && this.order.cartList.length > 0)
            )
          ) {
            this.$message.error("产品项次不可为空，请重新选择产品");
            this.loading = false;
            return;
          }
          let res = await this.api.sysSaveOrder(this.order);
          this.loading = false;
          if (res.code == 0) {
            this.$message({
              message: "提交成功！",
              type: "success",
            });

            const qry = new this.Query();
            qry.buildPageClause(1, 10);

            const param = qry.getParam();
            let resCart = await this.api.getCartBatchListByPage(param);

            if (resCart.code === 0) {
              this.store.commit("setCartNum", resCart.data.total);
            }
            this.$router.push("/service/order");
            // setTimeout(() => {
            //   this.$router.push("/service/order");
            // }, 1500);
          }
        }
      },
    },
    components: {
      projectList,
      AddAddress,
      addressManage,
      AddNetwork,
      networkManage,
    },
  };
</script>
<style lang="less">
  .next-month {
    color: #606266 !important;
  }
</style>
<style scoped lang="less">
  @import url("../../../../assets/css/common.less");

  .order {
    width: 100%;
    background-color: #f5f5f5;
    padding-bottom: 20px;

    .title {
      width: 1200px;
      margin: 0px auto;
      padding: 20px 0;

      span {
        &:nth-of-type(1) {
          cursor: pointer;
        }
      }
    }

    .order-content {
      box-sizing: border-box;
      width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      padding: 0 20px;

      .order-info,
      .choose-man,
      .logistics-fee,
      .choose-address {
        padding: 20px 0;
        border-bottom: 1px solid #e1e1e1;
      }

      .choose-address {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;

        p {
          flex: 1;
        }

        button {
          flex: 0 0 auto;
          background-color: #fff;
          color: #0060ff;
        }
      }

      .order-type {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        padding: 20px 0;

        >div {
          flex: 1;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;

          &:nth-last-of-type(1) {
            >div {
              &:nth-last-of-type(1) {
                .el-input {
                  width: 120px;
                }
              }
            }
          }

          >div {
            width: 33%;
            display: flex;
            display: -webkit-flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-bottom: 20px;

            &:not(:nth-of-type(1)) {
              margin-left: 3%;
            }

            span {
              width: 120px;
            }

            el-select {
              flex: 1 0 auto;
            }
          }
        }
      }

      .choose-man-cont,
      .logistics-fee-cont,
      .choose-address-cont {
        padding: 20px 0;
      }

      .choose-man-cont {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;

        .el-radio-group {
          flex: 0 0 auto;
        }

        .el-input {
          margin-left: 30px;
          width: 400px;
        }
      }

      .choose-address-cont {
        /*display: flex;
        display: -webkit-flex;*/
        flex-flow: row nowrap;
        align-items: flex-end;
        height: 300px;
        overflow-y: scroll;
      }

      .confirm-order {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        padding: 20px 0;

        i {
          font-style: normal;
          margin-left: 40px;
          color: #ff4800;
          font-size: 12px;
        }
      }

      .cart-table {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;

        >div {
          flex: 1;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          border-bottom: 1px solid #e1e1e1;

          >div {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            &:nth-of-type(1) {
              width: 10%;
              display: flex;
              display: -webkit-flex;
              justify-content: center;
            }

            &:nth-last-of-type(1),
            &:nth-last-of-type(2) {
              width: 15%;
            }

            &:nth-of-type(2),
            &:nth-of-type(3) {
              width: 20%;
            }

            &:nth-of-type(4) {
              width: 10%;
            }
          }

          &:nth-of-type(1) {
            background-color: #eee;
          }

          &:not(:nth-of-type(1)) {
            padding: 20px 0;
          }
        }
      }

      .note {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        padding: 20px 0;

        span {
          width: 80px;
        }

        textarea {
          flex: 1;
          height: 100px;
        }
      }

      .integral {
        height: 53px;
        display: flex;
        align-items: center;
        font-size: 18px;

        .blue {
          font-size: 16px;
          color: #1f5ed1;
        }
      }
    }

    .order-footer {
      color: #999;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      width: 1200px;
      margin: 20px auto 0;
      background-color: #fff;

      >div {
        padding: 10px 0;
      }

      .checked-all {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        background-color: #fff;

        >div {
          flex: 0 0 auto;
          margin-right: 40px;

          button {
            background-color: #fff;
            color: #999;
            cursor: pointer;
          }
        }
      }

      .btn {
        flex: 0 0 auto;
        width: 10%;
        background-color: #ff9801;

        button {
          width: 100%;
          height: 100%;
          background-color: #ff9801;
          color: #fff;
          cursor: pointer;
        }
      }
    }

    .el-dialog {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;

      .dialog-title {
        text-align: center;
        font-size: 24px;
        padding-bottom: 20px;
      }

      .selector {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 20px;

        >div {
          flex: 1;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          align-items: center;

          span {
            /*width: 130px;*/
          }

          >div {
            flex: 1;
            padding-left: 10px;
            padding-right: 10px;
          }

          el-select,
          el-input {
            flex: 1;
          }
        }
      }

      .el-pagination {
        padding: 20px 0;
        border-top: 1px solid #dfdfdf;
      }

      .opreate-dialog {
        padding-top: 10px;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        >div {
          width: 47%;
          display: flex;
          flex-flow: row nowrap;

          button {
            padding: 10px 0;
            width: 180px;
            border-radius: 6px;
            background-color: @btnColor;
            color: #fff;
          }

          &:nth-of-type(1) {
            justify-content: flex-end;

            button {
              border: 1px solid @btnColor;
              background-color: #fff;
              color: @btnColor;
            }
          }
        }
      }
    }
  }
</style>
