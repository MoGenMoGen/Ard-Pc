<template>
  <div class="order-list">
    <div class="title">
      <span>订单编号：{{ info ? info.orderCode : "" }}</span>
      <button
        class="button3"
        v-if="info.status === 50 || info.status === 99"
        @click.stop="express"
      >
        查看物流
      </button>
      <button class="button3" @click="toDetail">查看详情</button>
      <button
        class="button2"
        v-if="info.status === 50"
        @click.stop="confirmReceive"
      >
        确认收货
      </button>
      <button class="button2" v-if="info.status === 0" @click.stop="cancelOp">
        取消订单
      </button>
      <el-button
        v-if="
          info.status === 0 ||
          info.status === 60 ||
          info.status === 70 ||
          info.status === 80
        "
        @click="changeOrderAddr"
        >修改地址</el-button
      >
      <el-dropdown
        v-if="
          info.status === 0 ||
          info.status === 60 ||
          info.status === 70 ||
          info.status === 80
        "
        split-button
        type="primary"
        @command="sOptionToAdd"
      >
        增加项次
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="item.id"
            v-for="(item, index) in dropdownList"
            :key="index"
            >{{ item.nm }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="info" plain @click="exptone(info.id)"
        >订单导出</el-button
      >
    </div>
    <div class="table-header">
      <span class="span1">序号</span>
      <span class="span2">产品名称</span>
      <span class="span3">定制属性</span>
      <span class="span5">定制类型</span>
      <span class="span6">单价(元)</span>
      <span class="span11">激光切割费单价</span>
      <span class="span8">其他费用</span>
      <span class="span7">数量</span>
      <span class="span8">金额(元)</span>
      <span class="span10">订单状态</span>
      <span class="span9">操作</span>
    </div>
    <div class="list" v-if="info">
      <ul>
        <li
          v-for="(item, index) in info.orderItemList"
          :key="item.id"
          class="item"
        >
          <div class="div1">{{ index + 1 }}</div>
          <div class="div2">{{ item.productName }}</div>
          <div class="div3">
            <p v-for="(v, i) in item.productAttributeList" :key="i">
              {{ v.attributeKeyName }}：{{ v.attributeValueName }}
            </p>
          </div>

          <div class="div5" v-if="item.productType === 1">定制</div>
          <div class="div5" v-else-if="item.productType === 2">艺术定制</div>
          <div class="div5" v-else-if="item.productType === 3">专属定制</div>
          <div class="div5" v-else-if="item.productType === 0">标准</div>
          <div class="div5" v-else>标准</div>

          <div class="div6" v-if="!notShowTotal">￥{{ item.productPrice }}</div>
          <div class="div6" v-else></div>
          <div class="div11" v-if="!notShowTotal">￥{{ item.cutPrice }}</div>
          <div class="div11" v-else></div>
          <div class="div8" v-if="!notShowTotal">￥{{ item.extPrice }}</div>
          <div class="div8" v-else></div>
          <div class="div7">{{ item.orderNum }}</div>
          <div class="div8" v-if="!notShowTotal">
            ￥{{ item.productAmount }}
          </div>
          <div class="div8" v-else></div>
          <div class="div10" v-if="item.status === -2">审核不通过</div>
          <div class="div10" v-if="item.status === -1">取消</div>
          <div class="div10" v-if="item.status === 0">待审核</div>
          <div class="div10" v-if="item.status === 5">已同步MES</div>
          <div class="div10" v-if="item.status === 10">下料中</div>
          <div class="div10" v-if="item.status === 20">订单组装中</div>
          <div class="div10" v-if="item.status === 30">订单喷漆中</div>
          <div class="div10" v-if="item.status === 40">订单包装中</div>
          <div class="div10" v-if="item.status === 50">订货已发货</div>
          <div class="div10" v-if="item.status === 60">技术评审</div>
          <div class="div10" v-if="item.status === 70">客服评审</div>
          <div class="div10" v-if="item.status === 80">生管评审</div>
          <div class="div10" v-if="item.status === 90">待同步erp</div>
          <div class="div10" v-if="item.status === 99">完成</div>
          <!--列表项中的操作-->
          <div class="div9">
            <div v-if="item.status != '-1'">
              <!--  <p>{{item.orderType}}</p> -->
              <button
                v-if="
                  item.status === 0 ||
                  item.status === -2 ||
                  item.status === 60 ||
                  item.status === 70 ||
                  item.status === 80
                "
                class="button1"
                @click="editOrder($event, item, '修改订单')"
              >
                修改订单
              </button>
              <button
                v-if="
                  item.status === 0 ||
                  item.status === -2 ||
                  item.status === 60 ||
                  item.status === 70 ||
                  item.status === 80
                "
                class="button1"
                @click="updFuJian(item)"
              >
                修改附件
              </button>
              <button
                v-if="
                  item.status === 0 ||
                  item.status === -2 ||
                  item.status === 60 ||
                  item.status === 70 ||
                  item.status === 80
                "
                class="button1"
                @click="ediRemark(item)"
              >
                修改备注
              </button>

              <!-- <button class="button1" @click="cancelOrder($event,item.id)">取消订单</button> -->
              <!--<button-->
              <!--v-if="item.status===5 || item.status===10 || item.status===20 || item.status===30 ||
item.status===40"-->
              <!--class="button1"-->
              <!--@click="editOrder($event,item,'订单变更')"-->
              <!--&gt;订单变更</button>-->
              <!-- 只有在已完成跟待收货的时候显示 -->
            </div>
            <div v-else>订单已取消</div>
          </div>
        </li>
      </ul>
      <div class="bottom1">
        <span class="span1">合计：</span>
        <span class="span2"></span>
        <span class="span3"></span>
        <span class="span5"></span>
        <span class="span6"></span>
        <span class="span11"></span>
        <span class="span8"></span>
        <span class="span7">{{ totalNum }}</span>
        <span v-if="!notShowTotal" class="span8">￥{{ info.totalAmount }}</span>
        <span v-else class="span8"></span>
        <span class="span10"></span>
        <span class="span9"></span>
      </div>
    </div>

    <!-- 取消订单 -->
    <el-dialog
      title="取消订单"
      :visible.sync="cancelOrderVisible"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <span>请确认取消订单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCancelOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单 step1 -->
    <el-dialog
      :title="repairType"
      :visible.sync="editOrderVisible1"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <span v-if="repairType === '修改订单'"
        >请确认修改订单吗？修改订单会将状态重置为待审核并且重新审核</span
      >
      <span v-else>请确认变更订单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单 step2 -->
    <el-dialog
      title="修改订单数量"
      :visible.sync="editOrderVisible2"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-input-number
        v-model="num"
        @change="handleChange"
        :min="0"
        :max="repairType === '订单变更' ? maxOrderNum : Number.MAX_SAFE_INTEGER"
        label="描述文字"
      ></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditOrder2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改附件-->
    <el-dialog
      title="修改附件"
      :visible.sync="editFuJian"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="first-upload">
        <span>附件:</span>
        <el-upload
          class="upload-demo"
          action="string"
          :http-request="uploadImg"
          :multiple="true"
          :before-remove="beforeRemove"
          :limit="5"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handlePictureCardRemove"
          accept=".dwg, .jpg, .jpeg, .png, .pdf, .bmp"
        >
          <el-button size="medium" type="warning">点击上传</el-button>
        </el-upload>
        <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="auto" height="auto" :src="dialogImageUrl" alt />
        </el-dialog>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFuJian = false">取 消</el-button>
        <el-button type="primary" @click="submitFuJian">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单属性 -->
    <el-dialog
      :visible.sync="dialogShow"
      @close="closeDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <!-- tab切换 -->
      <div class="tab">定制属性</div>

      <!-- 步骤2 -->
      <div class="step-two">
        <div class="product-nm-two">
          <div>
            <p>
              <span>母料件：</span>
              <span>{{ selectPro.productSku }}</span>
            </p>
            <p>
              <span>母料件品名：</span>
              <span>{{ selectPro.productName }}</span>
            </p>
            <p class="note">
              注：产品的规格(尺寸单位为mm,面积单位为m
              <sup>2</sup>)跟属性为必填
            </p>
          </div>
        </div>

        <!-- 固定高度 -->
        <div class="table-size">
          <div class="product-info">
            <div
              class="parent-wrap"
              v-for="(itemProp, index) in stepArr"
              :key="index"
            >
              <div v-for="(item, index) in itemProp.children" :key="index">
                <div v-if="itemProp.children.length > 0 || item.type === 1">
                  {{ itemProp.name + "-" + item.name }}
                </div>
                <div v-else>{{ itemProp.name }}</div>

                <div v-if="item.type === 1">
                  <input
                    type="number"
                    @change="$set(form, form[item.code], '')"
                    v-model="form[item.code]"
                  />
                </div>
                <!-- 需要动态绑定每个选项的值 -->
                <el-select
                  v-model="form[item.code]"
                  @change="$set(form, form[item.code] + Random, $event)"
                  v-else
                  placeholder="请选择"
                >
                  <el-option
                    v-for="itemChild in item.attribueValueList"
                    :key="itemChild.id"
                    :label="itemChild.codeName"
                    :value="
                      itemChild.code + '_' + itemChild.name + '_' + itemChild.id
                    "
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="edit-number">
          <span>订单数量：</span>
          <el-input-number
            v-model="orderNum"
            @change="handleChange"
            :min="0"
          ></el-input-number>
        </div>
      </div>
      <!-- footer -->
      <div slot="footer" class="operate-footer">
        <!-- 只支持修改产品属性,不允许重新产品 -->
        <div class="btn-two">
          <div></div>
          <div class="second-btn">
            <button style="display: none"></button>
            <button @click="cancel">取消</button>
            <button @click="confirmProp">确认</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 查看物流 -->
    <el-dialog
      title="查看物流"
      :visible.sync="expressDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <express :expressList="expressList"></express>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      width="1300px"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <order-detail :info="detailInfo"></order-detail>
    </el-dialog>
    <!-- 增加项次之高端定制 -->
    <add-customize
      @changeDialog="getCustomizeShow"
      @showCaseImgOp="showCaseImgOp"
      @submitAddItem="addItem"
      :customizeDialog="customizeDialog"
      :writeProList="writeProList"
    ></add-customize>
    <!-- 增加项次之标准产品 -->
    <el-dialog
      title="增加标准产品"
      :visible.sync="standardProDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="input-no">
        <span class="order-label">产品编码：</span>
        <el-select
          @change="choosePro"
          v-model="inputProNo"
          filterable
          reserve-keyword
          placeholder="请输入关键词"
          :loading="loading"
        >
          <el-option
            v-for="item in standardProList"
            :key="item.id"
            :label="item.name + ',' + item.specName"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div class="input-no" style="margin-top: 3%">
        <span class="order-label">订单数量：</span>
        <el-input-number
          v-model="currentNum"
          @change="handleChange"
          :min="0"
        ></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="standardProDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmStandardPro">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 案例图片方法 -->
    <el-dialog class="case-img" :visible.sync="showCaseImg" append-to-body>
      <img :src="caseImgUrl" alt />
    </el-dialog>
    <!-- 修改订单地址 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="orderAddrVisible"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <add-address
        @cancalShow="orderAddrVisible = false"
        @saveAddress="editOrderAddress"
        :form="form"
      ></add-address>
    </el-dialog>

    <el-dialog
      title="修改订单备注"
      :visible.sync="editRemark"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <edit-remark
        @cancalShow="closeEditRemark"
        @saveRemark="submitRemark"
        :form="editRemarkForm"
      ></edit-remark>
    </el-dialog>
  </div>
</template>

<script>
import OrderDetail from "./OrderDetail";
import Express from "./Express";
import AddCustomize from "./AddCustomize";
import AddAddress from "./AddAddress";
import EditRemark from "./EditRemark";
export default {
  name: "orderlist",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      editFuJianOrderItemId: "",
      editFuJian: false,
      fileList: [],
      editRemarkForm: {},
      editRemark: false,
      currentNum: 1,
      id: "",
      detailInfo: {},
      totalAmount: 0,
      orderType: "5", //订单类型
      cancelOrderVisible: false,
      editOrderVisible1: false,
      editOrderVisible2: false,
      cancelItemId: "",
      editItemId: "",
      userInfo: {},
      num: 0,
      orderNum: 0,
      maxOrderNum: 0,
      stepArr: [],
      dialogShow: false,
      selectPro: {},
      form: {},
      idList: [],
      repairType: "修改订单",
      expressList: [],
      expressDialog: false,
      reverse: false,
      detailDialog: false,
      standardProDialog: false,
      customizeDialog: false,
      inputProNo: "",
      standardProList: [],
      writeProList: [],
      loading: false,
      showCaseImg: false,
      caseImgUrl: "",
      standPro: {},
      orderAddrVisible: false,
      dropdownList: [
        { nm: "高端定制", id: 1 },
        { nm: "标准产品", id: 2 },
      ],
    };
  },
  computed: {
    productWidth() {
      let length = 0;
      this.stepArr.map((item) => {
        length += item.children.length;
      });
      let width = 160 * length;
      return width > 912 ? width : "100%";
    },
    Random() {
      return Object.keys(this.form).length;
    },
    // 计算是否显示总金额
    notShowTotal() {
      return (
        this.info.status === -2 ||
        this.info.status === -1 ||
        this.info.status === 0 ||
        this.info.status === 60 ||
        this.info.status === 70 ||
        this.info.status === 80
      );
    },
    approveStatus() {
      return (
        this.info.status === -2 ||
        this.info.status === 0 ||
        this.info.status === 60 ||
        this.info.status === 70 ||
        this.info.status === 80
      );
    },
    totalNum() {
      if (this.info.orderItemList) {
        return this.info.orderItemList.reduce((p, n) => {
          return p + n.orderNum;
        }, 0);
      }
    },
  },
  mounted() {
    let userInfo = this.until.loGet("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }

    this.getInfo();
  },
  methods: {
    /**
     * 按照orderid导出
     * @param id
     */
    exptone(id) {
      window.open(
        "/crm/order/api/exptByOrderId?orderId=" +
          id +
          "&buyId=" +
          this.userInfo.userId
      );
    },
    async getExpressInfo() {
      const qry = new this.Query();
      qry.buildWhereClause("orderId", this.info.id, "EQ");
      const param = qry.getParam();

      const res = await this.api.logistics(param);
      //自己组合数据
      res.kuaidi.forEach((kuaidi, index) => {
        kuaidi.express = res.page.records[index].crmOrderExpressInfoVo;
        kuaidi.data.forEach((item, index) => {
          if (index === 0) {
            item.color = "#0bbd87";
          }
        });
        kuaidi.showMore = false;

        this.$set(res.kuaidi, index, kuaidi);
      });

      this.expressList = res.kuaidi;
    },
    showMoreOp(item, index) {
      item.showMore = !item.showMore;
      this.$set(this.expressList, index, item);
    },
    async toDetail(e) {
      this.detailDialog = true;
      this.detailInfo = await this.api.getOrdInfo(this.info.id);
    },
    cancelOp() {
      this.cancelOrderVisible = true;
    },
    handleChange(value) {
      this.standPro.orderNum = value;
      console.log(value);
    },
    back() {
      this.$router.back();
    },
    express: function () {
      // this.$router.push(`/service/express?id=${this.id}`);
      this.expressDialog = true;

      this.getExpressInfo();
    },
    async uploadImg(item) {
      //自定义上传图片事件
      const url = await this.api.postSendPicToService(item);
      // this.product.shapeImgUrl = this.product.shapeImgUrl
      //   ? `${this.product.shapeImgUrl},${url}`
      //   : url;
      // this.product.shapeRemark = this.product.shapeRemark
      //   ? `${this.product.shapeRemark},${item.name}`
      //   : item.name;
      this.fileList.push({
        name: item.file.name,
        url,
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
      // this.dialogVisible = true;
    },
    handlePictureCardRemove(file, fileList) {
      this.fileList = fileList;
    },
    submitFuJian() {
      var orderItem = {};
      orderItem.id = this.editFuJianOrderItemId;
      let file = [];
      this.fileList.forEach((item) => {
        file.push(item.url);
      });
      let strings = file.join(",");
      orderItem.shapeImgUrl = strings;
      this.until
        .postData("/crm/order/api/updFuJian", JSON.stringify(orderItem))
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              message: "附件修改成功",
              type: "success",
            });
            this.editFuJian = false;
            setTimeout(() => {
              this.$emit("refresh", this.info);
            }, 150);
          }
        });
    },
    updFuJian(item) {
      this.$confirm(
        "请确认修改订单吗？修改订单会将状态重置为待审核并且重新审核",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.editFuJianOrderItemId = "";
          this.editFuJianOrderItemId = item.id;
          this.until.get("/crm/orderItem/info/" + item.id).then((res) => {
            if (res.code == 0) {
              let conractFileArr = res.data.shapeImgUrl.split(",");
              this.fileList = [];
              for (let i = 0; i < conractFileArr.length; i++) {
                if (conractFileArr[i] != "")
                  this.fileList.push({
                    code: conractFileArr[i],
                    name: "附件" + (i + 1),
                    url: conractFileArr[i],
                  });
              }
              this.editFuJian = true;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          return;
        });
    },
    editOrder(e, item, type) {
      e.stopPropagation();
      this.repairType = type;
      this.maxOrderNum = item.orderNum;
      this.num = item.orderNum;
      this.orderNum = item.orderNum;
      this.editItemId = item.id;
      this.selectPro = item;
      this.editOrderVisible1 = true;
    },
    closeEditRemark() {
      this.editRemark = false;
    },
    ediRemark(item, type) {
      this.$confirm(
        "请确认修改订单吗？修改订单会将状态重置为待审核并且重新审核",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          var form = {};
          form.id = item.id;
          form.remark = item.remark;
          form.installSite = item.installSite;
          form.remarkProduct = item.remarkProduct;
          this.editRemarkForm = form;
          this.editRemark = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          return;
        });
    },
    cancelOrder(e, id) {
      e.stopPropagation();
      this.cancelItemId = id;
      this.cancelOrderVisible = true;
    },
    submitRemark(form) {
      this.until.post("/crm/order/api/updRemark", form).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "订单备注修改成功",
            type: "success",
          });
          this.editRemark = false;
          setTimeout(() => {
            this.$emit("refresh", this.info);
          }, 150);
        }
      });
    },
    confirmEditOrder() {
      if (this.repairType === "修改订单") {
        //去查询stepArr
        this.api
          .getProductAttributeByProNo(this.selectPro.productSku)
          .then((res) => {
            this.stepArr = res;
            if (res.length > 0) {
              this.dialogShow = true;
            } else {
              this.editOrderVisible2 = true;
            }
          });

        // console.log(12345, this.selectPro.productAttributeList);
        this.selectPro.productAttributeList.map((item) => {
          if (item.attributeValueCode)
          {
            this.form[item.attributeKeyCode] =
              item.attributeValueCode + "-" + item.attributeValueName;
          }
          else
          this.form[item.attributeKeyCode] = item.attributeValueName;
        });
      } else {
        this.editOrderVisible2 = true;
      }

      this.idList = this.selectPro.productAttributeList.map((item) => {
        return { key: item.attributeKeyCode, value: item.attributeValueId };
      });
      this.editOrderVisible1 = false;
    },
    confirmCancelOrder() {
      this.cancelOrderVisible = false;

      //取消订单传参
      const param = {
        id: this.info.id,
      };
      this.api.postCancelOrder(param).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "取消订单成功！",
            type: "success",
          });
          // this.getInfo();
          this.$emit("closeOrderDetail", false);
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //修改订单数量
    async confirmEditOrder2() {
      this.editOrderVisible2 = false;
      let editItem = {
        id: this.editItemId,
        orderNum: this.num,
      };
      let editList = [];
      editList.push(editItem);

      //修改订单传参
      let param = {
        id: this.info.id,
        updBy: this.userInfo.agentInfoId,
        itemList: JSON.stringify(editList),
      };

      let res;
      if (this.approveStatus) {
        res = await this.api.sysUpdateOrder(param);
      } else {
        res = await this.api.sysChangeOrder(param);
      }
      if (res.code === 0) {
        this.$message({
          message: "提交成功！",
          type: "success",
        });
        this.$emit("refresh", this.info);
        this.dialogShow = false;
        setTimeout(() => {
          this.getInfo();
        }, 1500);
        // setTimeout(() => {
        //   this.$router.push("/service/order");
        // }, 1500);
      }
    },
    confirmReceive() {
      this.api.postFinishOrder({ id: this.info.id }).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "确认收货成功！",
            type: "success",
          });
          //需要刷新当前dialog
          this.$emit("refresh", this.info);
        }
      });
    },
    closeDialog() {
      this.dialogShow = false;
    },
    cancel() {
      this.dialogShow = false;
    },
    confirmProp: async function () {
      //订单属性确定修改,把分散的prop重新拼进订单属性，并提交
      /*
       * 逻辑说明
       * 如果 订单是 1 2 3
       * 产品属性修改为 1 3 4
       * 先将idlist 变为 1234
       * 再使用idlist和stepArr 将2 排除，这样就完成了属性的重新拼接
       * 在这个confirmEditOrder（）方法中将2给删除了，下面的idlist删除是为了在添加属性的时候将2给排除
       *如果有人维护了这个那就仔细看看吧，因为这里的变量实在是不知道怎么去命名，
       *
       * */
      let filter = this.info.orderItemList.filter(
        (item) => item == this.selectPro
      );
      console.log(this.selectPro);
      let var1 = []; //实际存在的属性 订单项次中的属性
      let var4 = []; //应该存在的属性  对应的项次的产品应该的属性
      this.stepArr.forEach((value) => {
        //stepArr 是对应的项次的产品应该的属性的集合
        value.children.forEach((value1) => {
          var4.push(value1.code);
        });
      });
      var1 = this.idList.map((item) => item.key);
      //将原先没有的添加上
      this.stepArr.forEach((value) => {
        value.children.forEach((value1) => {
          if ($.inArray(value1.code, var1) < 0) {
            var valuevar = this.form[value1.code];
            var var3 = "";
            if (valuevar && valuevar.indexOf("_") > 0) {
              var3 = valuevar.split("_")[2];
            }
            var var2 = {};
            var2.key = value1.code;
            var2.value = var3;
            this.idList.push(var2);
          }
        });
      });

      //将多的删除
      for (var i = 0; i < this.idList.length; i++) {
        if ($.inArray(this.idList[i].key, var4) < 0) {
          this.idList.splice(i, 1);
          i--;
        }
      }

      for (let index = 0; index < this.idList.length; index++) {
        if (this.idList[index].key.indexOf("C") == -1) {
          let name = this.idList[index].value;
          if (!name) {
            this.$message.error("您还没有填写完产品属性,不能确定！");
            this.confirmEditOrder();
            return;
          }
        }
      }

      this.idList.forEach((item) => {
        let value = this.form[item.key];
        if (value && value.indexOf("_") > 0) {
          value = value.split("_")[2];
          item.value = value;
        }
      });
      //将没有的属性添加进去
      this.stepArr.forEach((value) => {
        value.children.forEach((value1) => {
          if ($.inArray(value1.code, var1) < 0) {
            var valuevar = this.form[value1.code];

            var orderId = this.selectPro.orderId;
            var orderItemId = this.selectPro.id;

            var productAttribute = {
              id: "",
              orderId: "",
              orderItemId: "",
              productSku: "",
              attributeKeyCode: "",
              attributeKeyName: "",
              attributeValueId: "",
              attributeValueCode: "",
              attributeValueName: "",
              attributeRemark: "",
              attributeImgUrl: "",
            };
            productAttribute.orderId = orderId;
            productAttribute.orderItemId = orderItemId;
            productAttribute.attributeKeyCode = value1.code;
            productAttribute.attributeKeyName = value1.name;
            var var3 = "";
            if (valuevar && valuevar.indexOf("_") > 0) {
              productAttribute.attributeValueName = valuevar.split("_")[1];
              productAttribute.attributeValueId = valuevar.split("_")[2];
              productAttribute.attributeValueCode = valuevar.split("_")[0];
            }
            filter[0].productAttributeList.push(productAttribute);
          }
        });
      });
      //属性排序
      let sortproductAttributeList = [];
      this.stepArr.forEach((value) => {
        value.children.forEach((value1) => {
          filter[0].productAttributeList.forEach((value2) => {
            if (value1.code == value2.attributeKeyCode) {
              sortproductAttributeList.push(value2);
            }
          });
        });
      });
      filter[0].productAttributeList = sortproductAttributeList;
      this.idList = this.idList.map((item) => item.value);
      this.idList = this.idList.filter((item) => item);
      const checkList = await this.api.getCheckRestrictionsList(this.idList);
      if (checkList) {
        for (let i = 0, len = checkList.length; i < len; i++) {
          const itemCheck = checkList[i];

          if (itemCheck.attributeCheckCode) {
            const valueOri = this.form[itemCheck.attributeCheckCode];
            let value = "";
            if (valueOri) {
              if (valueOri.indexOf("_") > 0) {
                value = valueOri.split("_")[0];
              } else {
                value = valueOri;
              }
            }

            if (
              value > itemCheck.attributeCheckMaxVal ||
              value < itemCheck.attributeCheckMinVal ||
              value === itemCheck.attributeCheckVal
            ) {
              this.$message.error(
                `您所选择的产品编码为${itemCheck.attributeCheckCode}存在约束条件，不能选择${itemCheck.attributeValNm}，请重
新选择`
              );
              return;
            }
          }
        }
      }
      for (
        let index = 0;
        index < filter[0].productAttributeList.length;
        index++
      ) {
        let name =
          this.form[filter[0].productAttributeList[index].attributeKeyCode];
        if (!name) {
          this.$message.error("您还没有填写完产品属性,不能确定！");
          return;
        }
      }
      /*
       * 修改对应的属性code
       * */
      filter[0].productAttributeList.map((item) => {
        let value = this.form[item.attributeKeyCode];
        if (value && value.indexOf("_") > 0) {
          value = value.split("_")[0];
          item.attributeValueCode = value;
        }
      });
      filter[0].productAttributeCode = "";
      filter[0].productAttributeList.map((item) => {
        let name = this.form[item.attributeKeyCode];
        if (name && name.indexOf("_") > 0) {
          name = name.split("_")[1];
        }
        item.attributeValueName = name;
        filter[0].productAttributeCode += `#${item.attributeKeyCode}#|${item.attributeValueName}|`;
        delete item.id;
      });

      filter[0].productAttributes = filter[0].productAttributeList;
      filter[0].orderNum = this.orderNum;

      delete filter[0].productAttributeList;
      this.info.itemList = JSON.stringify(filter);
      delete this.info.orderItemList;

      for (let [k, v] of Object.entries(this.info)) {
        if (v === null) {
          delete this.info[k];
        }
      }
      delete this.info.crtTm;
      let res;
      if (this.approveStatus) {
        res = await this.api.sysUpdateOrder(this.info);
      } else {
        res = await this.api.sysChangeOrder(this.info);
      }

      if (res.code === 0) {
        this.$message({
          message: "提交成功！",
          type: "success",
        });
        this.$emit("refresh", this.info);
        this.dialogShow = false;
        setTimeout(() => {
          this.getInfo();
        }, 1500);
      }
    },
    async getInfo() {},
    sOptionToAdd(command) {
      if (command === 1) {
        this.customizeDialog = true;
        this.standardProDialog = false;
        this.getCustomizeProList();
      } else {
        this.customizeDialog = false;
        this.standardProDialog = true;
        this.remoteMethod();
      }
    },
    confirmStandardPro() {
      //标准产品确定的时候
      if (!this.inputProNo) {
        this.$message.error("您还未选择需要添加的标准产品，无法确定！");
        return;
      }
      console.log(this.standPro);
      this.addItem(this.standPro);
    },
    //选中产品
    choosePro(e) {
      let info = this.standardProList.find(
        (item) => item.code == this.inputProNo
      );
      //等待接口
      this.standPro.productSku = info.code;
      this.standPro.productImgUrl = info.imgMainUrl;
      this.standPro.buyNum = 1;
      this.standPro.productName = info.name;
      this.standPro.specName = info.specName;
      this.standPro.specId = info.specId;
      this.standPro.orderNum = 1;
      this.standPro.discount = info.discount;
      this.standPro.remark = "";
    },
    async getCustomizeProList() {
      const data = await this.api.sysSearchProductNo();
      this.writeProList = data.data;
    },
    //根据编码获取产品名称
    async remoteMethod() {
      this.currentNum = 1;
      const param = {
        pageSize: 0,
        pageNum: 1,
      };

      const data = await this.api.getProList(param);
      this.standardProList = data.result;
    },
    getCustomizeShow(val) {
      this.customizeDialog = val;
    },
    showCaseImgOp(val) {
      this.showCaseImg = val.caseImg;
      this.caseImgUrl = val.url;
    },
    async addItem(product) {
      this.info.itemList = this.info.orderItemList;
      product.orderId = this.info.id;
      console.log(this.info.orderItemList);
      this.info.itemList.push(product);
      this.info.itemList = JSON.stringify(this.info.itemList);
      delete this.info.orderItemList;

      for (let [k, v] of Object.entries(this.info)) {
        if (v === null) {
          delete this.info[k];
        }
      }
      delete this.info.crtTm;
      let res = await this.api.postAddNewOrderItem(this.info);
      if (res.code === 0) {
        this.$message({
          message: "增加项次成功！",
          type: "success",
        });
        this.customizeDialog = false;
        setTimeout(() => {
          this.$emit("refresh", this.info);
        }, 1500);
      } else {
        setTimeout(() => {
          this.$emit("refresh", this.info);
        }, 1500);
      }
    },
    async changeOrderAddr() {
      this.orderAddrVisible = true;
      this.detailInfo = await this.api.getOrdInfo(this.info.id);
      console.log(this.detailInfo.receiveAddress);
      this.form = {
        areaCode: "", //所在区划编码
        areaName: "", //所在区划名称
        linkMan: "", //收货联系人
        linkPhone: "", //收货联系人电话
        isDefault: "1", //是否默认
        address: "", //详细地址
        userId: "",
        receiver: this.detailInfo.receiver,
        receiverPhone: this.detailInfo.receiverPhone,
        receiveAddress: this.detailInfo.receiveAddress,
      };
    },
    editOrderAddress(addr) {
      //修改订单地址
      const param = {
        receiver: addr.linkMan,
        receiveAddress: `${addr.areaName}/${addr.address}`,
        receiverPhone: addr.linkPhone,
        id: this.info.id,
      };
      this.api.postEditOrderReveiveAddress(param).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "修改收货地址成功！",
            type: "success",
          });
          setTimeout(() => {
            this.orderAddrVisible = false;
          }, 1500);
        }
      });
    },
  },
  watch: {
    "info.orderItemList"(val) {
      // console.log('============')
      // console.log(val)
      if (!val) {
        return;
      }
      val.map((item) => {
        if (typeof item.productPrice === "number") {
          item.productAmount = item.productPrice * item.orderNum.toFixed(2);
        }
      });
    },
    info(val) {
      val.delieryTime = val.delieryTime ? val.delieryTime.split(" ")[0] : "";
    },
  },
  components: {
    OrderDetail,
    Express,
    AddCustomize,
    AddAddress,
    EditRemark,
  },
};
</script>

<style lang="less">
.el-dialog {
  min-height: 0;
  .span2 {
    margin-left: 0;
  }
}
</style>
<style scoped lang="less">
@import url("../../../../assets/css/common.less");
/*标题*/

.title {
  margin-left: 33px;
  color: #666666;
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 25px;
}
/*表头*/
.table-header {
  height: 50px;
  background: #eeeeee;
  line-height: 50px;
  display: flex;
}
.span1,
.div1 {
  margin-left: 33px;
  flex: 4;
}
.span2,
.div2 {
  flex: 6;
}
.span3,
.div3 {
  flex: 11;
}
.span4,
.div4 {
  flex: 5;
}
.span5,
.div5 {
  flex: 6;
}
.span6,
.div6 {
  flex: 5;
}
.span7,
.div7 {
  flex: 4;
}
.span8,
.div8 {
  flex: 5;
}
.span9,
.div9 {
  flex: 7;
  text-align: center;
  margin-right: 10px;
}
.span10,
.div10 {
  flex: 5;
}

.span11,
.div11 {
  flex: 9;
}
/*底部*/
.bottom1 {
  height: 50px;
  width: 100%;
  line-height: 50px;
  display: flex;
}

/*列表项*/
.item {
  padding-top: 18px;
  display: flex;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 15px;
}
.item div {
  color: #666666;
  font-size: 14px;
}
.item div p {
  margin-bottom: 5px;
}
/*第一种类型的button*/
.button1 {
  border: 1px solid #f6a33e;
  color: #f6a33e;
  font-size: 14px;
  width: 96px;
  height: 29px;
  text-align: center;
  line-height: 29px;
  margin-top: 15px;
  cursor: pointer;
  background: white;
  border-radius: 3px;
}
.button1:hover {
  background: #f6a33e;
  color: white;
}
/*第2种类型的button*/
.button2,
.button3 {
  cursor: pointer;
  border: 1px solid #f6a33e;
  padding: 10px 20px;
  background-color: #f6a33e;
  color: #fff;
  font-size: 16px;
  margin-top: 15px;
}

.button3 {
  color: #f6a33e;
  background-color: #fff;
}

.el-dialog {
  /*中间部分*/
  .center {
    margin-left: 33px;
  }
  .center p {
    margin-top: 31px;
    color: #666666;
    font-size: 18px;
  }
  /*底部*/
  .footer1 {
    margin-left: 33px;
    margin-top: 30px;
    .el-button--text {
      color: #17b3a3;
    }
  }
  .input-no {
    width: 60%;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    .order-label {
      width: 120px;
    }
    .el-select {
      flex: 1;
    }
  }
}
</style>
