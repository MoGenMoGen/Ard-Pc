<template>
  <div class="customize">
    <el-table :data="tableData" max-height="550">
      <el-table-column type="index" label="项次" width="50"></el-table-column>
      <el-table-column row-class-name="pro-no" label="产品编号" width="200">
        <template slot-scope="scope">
          <div class="proNo">
            <el-select
              v-if="!scope.row.pro"
              @change="choosePro(scope.row, scope.$index)"
              v-model="inputProNo"
              filterable
              reserve-keyword
              placeholder="请输入关键词"
            >
              <el-option
                v-for="item in writeProList"
                :key="item.id"
                :label="item.code + ',' + item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            <div @click="toShowInput(scope.row, scope.$index)" v-else>{{ scope.row.pro }}</div>
            <img @click="showDialog(scope.row, scope.$index,'add')" :src="category" alt/>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="attribute" label="定制属性" width="200"></el-table-column>
      <el-table-column prop="name" label="品名" width="150"></el-table-column>
      <el-table-column prop="unit" label="单位" width="50" align="center"></el-table-column>
      <el-table-column label="数量" width="80" align="center">
        <template slot-scope="scope">
          <input
            v-model.number.trim="scope.row.count"
            min="1"
            type="number"
            @change="changeNum(scope.row, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注（安装位置/开或不开）" width="150" align="center">
        <template slot-scope="scope">
          <textarea @blur="triggerTableData(scope.row,'installSite')" v-model="scope.row.installSite"></textarea>
        </template>
      </el-table-column>
      <el-table-column label="备注（项目名称）" width="150" align="center">
        <template slot-scope="scope">
          <textarea @blur="triggerTableData(scope.row,'remark')" v-model="scope.row.remark"></textarea>
        </template>
      </el-table-column>
      <el-table-column label="备注（其它产品信息）" width="150" align="center">
        <template slot-scope="scope">
          <textarea @blur="triggerTableData(scope.row,'remarkProduct')" v-model="scope.row.remarkProduct"></textarea>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">增加</el-button>
          <el-button
            v-if="tableData[scope.$index].pro"
            @click="modify(scope.row, scope.$index)"
            type="text"
            size="small"
          >修改
          </el-button>
          <el-button
            @click="delet(scope.row, scope.$index)"
            type="text"
            size="small"
            v-show="tableData.length > 1"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 操作 -->
    <div class="operate">
      <div class="btn">
        <!-- <button @click="toLocalStorage">暂保存</button> -->
        <button @click="toOrder">立即下单</button>
        <button @click="addCart">加入购物车</button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogShow" @close="closeDialog" :close-on-click-modal="false">
      <!-- tab切换 -->
      <div class="tablist">
        <div :class="{ active: stepOne === true }">1 / 产品编号</div>
        <div :class="{ active: stepTwo === true }">2 / 定制属性</div>
      </div>
      <!-- 详细展示  步骤1-->
      <div
        class="step-one"
        :class="{ 'step-center': showInput === true }"
        v-if="stepOne === true && !stepTwo"
      >
        <div class="input-no" v-if="showInput">
          <span class="order-label">产品编码：</span>
          <el-select
            nm="input"
            v-focus
            @focus="getBlur('input')"
            @change="choosePro"
            v-model="inputProNo"
            ref="proNo"
            filterable
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in writeProList"
              :key="item.id"
              :label="item.code + ',' + item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <div class="select-pro" v-if="!showInput">
          <div>
            <div class="selector">
              <div>
                <span>系列：</span>
                <el-select @focus="getBlur('input')"
                           ref="proNoTwo"
                           v-model="val" placeholder="请选择" value-key="id" @change="changePro">
                  <el-option
                    v-for="item in proList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <span>功能：</span>
                <el-select v-model="product.productFunCode" @focus="getBlur('input')" placeholder="请选择"
                           @change="changeFunc">
                  <el-option
                    v-for="item in funList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <span>形状：</span>
                <el-select
                  v-model="product.productShapeCode"
                  placeholder="请选择"
                  @change="changeShape"
                  @focus="getBlur('input')"
                >
                  <!-- 没用item.id item.code 因为返回有重复 -->
                  <el-option
                    v-for="item in shapeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <span>面板材质：</span>
                <el-select v-model="panelMaterialId" @focus="getBlur('input')" placeholder="请选择" @change="getPanel">
                  <el-option
                    v-for="item in panelMaterialList"
                    :key="item.id"
                    :label="item.materialName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="product-info">
              <div class="product-num">
                <div>产品编号</div>
                <div>{{ product.productSku }}</div>
              </div>
              <div class="product-nm">
                <div>产品名称</div>
                <div>{{ product.productName }}</div>
              </div>
              <div class="product-detail">
                <div>产品图片</div>
                <div>
                  <img :src="product.ilikeLogUrl" alt/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 步骤2 -->
      <div class="step-two" v-if="stepTwo === true">
        <div class="product-nm-two">
          <div>
            <p>
              <span>母料件：</span>
              <span>{{ product.productSku }}</span>
            </p>
            <p>
              <span>母料件品名：</span>
              <span>{{ product.productName }}</span>
            </p>
            <p class="note">
              注：产品的规格(尺寸单位为mm,面积单位为m
              <sup>2</sup>)跟属性为必填
            </p>
          </div>
          <img :src="caseImgUrl" @click="showCaseImg = true" alt/>
        </div>

        <!-- 固定高度 -->
        <div class="table-size">
          <div class="product-info">
            <div class="parent-wrap" v-for="(itemProp, index) in stepArr" :key="index">
              <div v-for="(item, index) in itemProp.children" :key="index">
                <div v-if=" item.type === 1">{{ itemProp.name + "-" + item.name }}</div>
                <div v-else>
                  <span v-if="itemProp.children.length > 1">{{ itemProp.name + "-" + item.name }}</span>
                  <span v-else>{{ item.name }}</span>
                </div>

                <div v-if="item.type === 1">
                  <input v-if="index==0" ref="proNext" v-focus @focus="getBlur('input')" type="number" min="0"
                         v-model="form[`${item.code}`]"/>
                  <input v-else type="number" min="0" @focus="getBlur('input')" v-model="form[`${item.code}`]"/>
                </div>
                <!-- 需要动态绑定每个选项的值 -->
                <el-select v-model="form[`${item.code}`]" ref="proNext" @focus="getBlur('input')" v-else nm="noConfirm"
                           placeholder="请选择" filterable default-first-option>
                  <el-option
                    v-for="itemChild in item.attribueValueList"
                    :key="itemChild.id"
                    :label="itemChild.code+':'+itemChild.name"
                    :value="
                      itemChild.code + '_' + itemChild.name + '_' + itemChild.id
                    "
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
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
            <el-button size="medium" type="warning" @focus="getBlur('input')">点击上传</el-button>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="auto" height="auto" :src="dialogImageUrl" alt />
          </el-dialog>-->
        </div>
      </div>
      <!-- footer -->
      <div slot="footer" class="operate-footer" :class="{ 'center-btn': showInput === true }">
        <div class="btn" v-if="stepOne === true && !stepTwo">
          <button @click="cancel" @focus="getBlur('cancel')" :class="{blur:inputType=='cancel'}">取消</button>
          <button @click="nextStep" @focus="getBlur('next')" :class="{blur:inputType=='next'}">下一步</button>
        </div>
        <div class="btn-two" v-if="stepTwo === true">
          <div class="second-btn">
            <button @click="preStep" @focus="getBlur('pre')" :class="{blur:inputType=='pre'}">上一步</button>
            <button @click="cancel" @focus="getBlur('cancel')" :class="{blur:inputType=='cancel'}">取消</button>
            <button @click="confirmProp" @focus="getBlur('confirm')" :class="{blur:inputType=='confirm'}">确认</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="case-img" :visible.sync="showCaseImg">
      <img :src="caseImgUrl" alt/>
    </el-dialog>
    <!-- 加入购物车的时候选择批次 -->
    <pick-batch
      :cartBatchVisible="cartBatchVisible"
      @changeBatchDialog="getDialogShow"
      @pickBatchCertain="pickBatchCertain"
    ></pick-batch>
  </div>
</template>

<script>
import category from "../images/categlory.png";
import ilikeLog from "../images/ilikelog.png";
import PickBatch from "@/components/PickBatch";

export default {
  data() {
    return {
      val: {},
      inputType: '',
      category,
      ilikeLog,
      dialogShow: false,
      stepOne: true,
      stepTwo: false,
      showInput: false,
      inputProNo: "",
      writeProList: [],
      form: {},
      propArr: [],
      panelMaterialId: "",
      imgUrl: "",
      caseImgUrl: "",
      showCaseImg: false,
      product: {
        productAttributes: [],
        productAttributeCode: "",
        productCatCode: "",
        productCatName: "",
        productFunCode: "",
        productFunName: "",
        productShapeCode: "",
        productShapeName: "",
        panelMaterialCode: "",
        panelMaterialName: "",
        productSku: "",
        productName: "",
        ilikeLogUrl: "",
        orderNum: 1,
        discount: "",
        productUnitCode: "",
        productUnitName: "",
        shapeImgUrl: "",
        shapeRemark: "",
        code:''
      },
      tableData: [
        {
          // no: "1",
          pro: "",
          attribute: "",
          name: "",
          unit: "",
          count: 1, //以下字段提供修改
          product: {}, //第一步
          form: {},
          fileList: [] //第二部
        }
      ],
      tableObj: {
        // no: "",
        pro: "",
        attribute: "",
        inputNo: "",
        name: "",
        unit: "",
        count: 1,
        installSite: "",
        remark: "",
        remarkProduct: "",
        product: {}, //第一步
        form: {} //第二步
      },
      stepArr: [],
      proObj: {
        attributeNm: ""
      },
      proList: [],
      funList: [],
      shapeList: [],
      selectRow: 0,
      panelMaterialList: [],
      operateRow: 0,
      cartList: [],
      fileList: [],
      fileList1: [],
      dialogType: 0,
      modifyProduct: false,
      showFirstStep: true,
      cartBatchVisible: false,
      userInfo: {},
      cartCatRemark: "",
      cartCatId: "",
      dialogVisible: false,
      dialogImageUrl: "",
      forbidden: [],
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  watch: {
    // "product.productFunCode"(val) {
    //   if (this.product.panelMaterialCode && this.product.productShapeCode) {
    //     this.getPanel();
    //   }
    // },
    "product.panelMaterialCode"(val) {
      if (val) {
        this.getPanel(this.panelMaterialId);
      }
    }
  },
  computed: {
    length() {
      return this.tableData.length;
    },
    cartLength() {
      return this.cartList.length;
    },
    productNo() {
     // return `1${this.val.code}${this.product.productFunCode}${this.product.productShapeCode}${this.product.panelMaterialCode}`;
      return `1${this.product.code}${this.product.productFunCode}${this.product.productShapeCode}${this.product.panelMaterialCode}`;
    },
    productWidth() {
      let length = 0;
      this.stepArr.map(item => {
        length += item.children.length;
      });
      let height = 41 * length;
      return width > 912 ? width : "100%";
    }
  },
  components: {
    PickBatch
  },
  async mounted() {
    this.enterKeyup();
    if (!this.until.loGet("userInfo")) {
      this.$confirm("您还没有登录，立即登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再看看",
        type: "warning"
      })
        .then(() => {
          this.until.href("../home/login.html");
        })
        .catch(() => {
          this.until.href("../home/index.html");
        });
      return;
    } else {
      const tableDataStr = this.until.loGet("tableData");
      const cartListStr = this.until.loGet("cartList");
      if (tableDataStr) {
        this.tableData = JSON.parse(tableDataStr);
      }

      if (cartListStr) {
        this.cartList = JSON.parse(cartListStr);
      }
      await this.getProList();
      await this.remoteMethod();
      this.userInfo = this.until.loGet("userInfo");

      //立即下单折扣
      let userObj = JSON.parse(this.userInfo);
      this.product.discount = userObj.discount ? userObj.discount : 1;
      this.getForbidden()
    }
  },
  methods: {

    //获取禁止符号
    async getForbidden() {
      this.forbidden = await this.api.getBaseDictionaryList("XmlCanTUnderstandString");
    },
    //焦点状态
    getBlur(type) {
      // console.log('焦点状态:'+type)
      this.inputType = type
    },
    triggerTableData(item, val) {
      if (item[val]) {
        let index = this.forbidden.findIndex(v => {
          return item[val].indexOf(v.nm) > -1
        })
        if (index > -1) {
          let text = []
          this.forbidden.forEach(v => {
            text.push(v.nm)
          })
          this.$alert(text.join(',') + '输入框中含有这些禁止符号，请去掉所有禁止符号', '', {
            confirmButtonText: '确定',
            callback: () => {
              this.forbidden.forEach(v => {
                if (item[val].indexOf(v.nm) > -1) {
                  item[val] = item[val].replace(RegExp(v.nm, "g"), '')
                  // console.log(item[val])
                }
              })
            }
          });
        }
      }

      this.until.loSave("tableData", JSON.stringify(this.tableData));
    },
    changeNum(obj, index) {
      let num = obj.count;
      if (!obj.count || obj.count <= 0) {
        this.$message("请输入大于0的整数");
        obj.count = 1;
        this.$set(this.tableData, index, obj);
        return;
      }

      if (String(num).indexOf(".") > -1) {
        obj.count = parseInt(String(num).split(".")[0]);
        this.$set(this.tableData, index, obj);
      }
      this.until.loSave("tableData", JSON.stringify(this.tableData));
    },
    //类型选择面板
    showDialog(row, index, type) {
      console.log(111111111111)

      return new Promise((resolve, reject) => {
        this.selectRow = index;
        this.dialogShow = true;
        this.stepOne = true;
        this.stepTwo = false;
        this.showInput = false;
        this.tableData[this.selectRow].inputNo = "";
        if (!row.pro) {
          this.showFirstStep = true;
          this.dialogType = 0;
          this.panelMaterialId = "";
          let data = {};
          for (let [k, v] of Object.entries(this.product)) {
            if (k === "productAttributes") {
              v = [];
            } else if (k === "orderNum") {
              v = 1;
            } else {
              v = "";
            }
            data[k] = v;
          }

          this.product = data;
          this.form = {};
          this.fileList = [];
        } else {
          if (type !== "modify") {
            this.dialogShow = false;
            this.$message.error(
              "请选择右边的'修改'按钮修改属性,如需新增请点击'增加'按钮"
            );
          }
          let filter = this.tableData.filter((item, i) => i === index);
          this.form = {...filter[0].form};
          this.product = {...filter[0].product};
          this.fileList = filter[0].fileList;
        }
        this.$nextTick(() => {
          // this.$refs.proNoTwo.focus()
        })

        resolve(this.product);
      });
    },
    //商品编号选择
    toShowInput(row, index) {
      this.selectRow = index;
      this.dialogShow = true;
      this.stepOne = true;
      this.inputProNo = "";
      this.stepTwo = false;
      this.showInput = true;
      this.dialogType = 0;
      if (!row.pro) {
        this.showFirstStep = true;
        let data = {};
        for (let [k, v] of Object.entries(this.product)) {
          if (k === "productAttributes") {
            v = [];
          } else if (k === "orderNum") {
            v = 1;
          } else {
            v = "";
          }
          data[k] = v;
        }

        this.product = data;
        this.form = {};
        this.fileList = [];
      } else {
        this.dialogShow = false;
        this.$message.error(
          "请选择右边的'修改'按钮修改属性,如需新增请点击'增加'按钮"
        );
      }

      //产品编号吧stepArr清空，因为不会再出现左边
    },
    closeDialog() {
      this.dialogShow = false;
      this.proObj = {};
      this.stepArr = [];
    },
    //跳转到详情页面
    toDetail(ipPk) {
      this.$router.push({
        path: "/industryDetail",
        query: {
          ipPk: ipPk
        }
      });
    },
    preStep() {
      console.log('上一步')
      this.inputType = ''
      this.stepOne = true
      this.stepTwo = false;
      //根据选择的产品信息得到第一步的界面,统一退回到选择页面，并且属性都为空
      this.product = {
        productAttributes: [],
        productAttributeCode: "",
        productCatCode: "",
        productCatName: "",
        productFunCode: "",
        productFunName: "",
        productShapeCode: "",
        productShapeName: "",
        panelMaterialCode: "",
        panelMaterialName: "",
        productSku: "",
        productName: "",
        ilikeLogUrl: "",
        orderNum: 1,
        discount: "",
        productUnitCode: "",
        productUnitName: "",
        shapeImgUrl: "",
        shapeRemark: ""
      };
      this.form = {};
      this.panelMaterialId = "";
      this.$nextTick(() => {
        if (this.showInput) {
          this.$refs.proNo.focus()
        } else {
          this.$refs.proNoTwo.focus()
        }
      })

    },
    cancel() {
      this.inputType = ''
      this.dialogShow = false;
      this.product.shapeRemark = "";
      this.product.shapeImgUrl = "";
      this.proObj = {};
      //this.proList = [];
      this.funList = [];
      this.shapeList = [];
      this.panelMaterialList = [];
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
      // this.dialogVisible = true;
    },
    handlePictureCardRemove(file, fileList) {
      this.fileList = fileList;
    },
    async uploadImg(item) {
      //自定义上传图片事件
      const url = await this.api.postSendPicToService(item);
      this.product.shapeImgUrl = this.product.shapeImgUrl
        ? `${this.product.shapeImgUrl},${url}`
        : url;
      this.product.shapeRemark = this.product.shapeRemark
        ? `${this.product.shapeRemark},${item.name}`
        : item.name;
      this.fileList.push({
        name: item.file.name,
        url
      });
    },
    async nextStep(index = 0) {
      if (this.showInput && !this.inputProNo) {
        //第一步是填写编号，但是并没有填写时提示
        this.$message("请输入商品编码选择商品");
        return;
      } else {
        // console.group()
        // console.log(this.selectRow)
        // console.log(this.tableData)
        // console.groupEnd()
        this.tableData[this.selectRow].inputNo = this.inputProNo;
      }

      if (!this.showInput && !this.modifyProduct) {
        //第 二步是通过选择类型来选定产品，但是还没有选定商品时的提示
        if (!this.product.productCatCode) {
          this.$message("产品系列不能为空");
          return;
        }
        if (!this.product.productFunCode) {
          this.$message("产品功能不能为空");
          return;
        }
        if (!this.product.productShapeCode) {
          this.$message("产品形状不能为空");
          return;
        }
        if (!this.product.panelMaterialCode) {
          this.$message("产品面板材质不能为空");
          return;
        }
        console.log(this.proObj.code)
        console.log(this.productNo)
        console.log(this.proObj.code.substr(0, 6))
        // if (!this.proObj.code || this.productNo !== this.proObj.code.substr(0, 6)) {
        //   this.$message("当前网络较慢，商品未载入，请3秒后再点击下一步");
        //   return;
        // }
      }
      this.inputType = ''
      this.stepTwo = false
      this.stepTwo = true;
      this.modifyProduct = false;
      //新增

      const proNo =
      this.proObj.code || this.inputProNo || this.tableData[index].pro;
      this.inputProNo = ""  //当对下完单的商品进行修改时，访问接口的参数为新添加的商品的sku编码，所以需要在这里将输入的编码清空
      this.stepArr = []
      this.propArr = [];
      this.stepArr = await this.api.getProductAttributeByProNo(proNo);
      var sortList = await this.api.getProductAttributeByProNoSort(proNo);
      var tempList = [];
      this.stepArr.map(item => {
        item.children.map(itemChild => {
          tempList.push(itemChild);
        });
      });
      sortList.map(item => {
        let tempFindItem = tempList.find(tempItem => item.attributeCode === tempItem.code)
        this.propArr.push(tempFindItem)
      })
      //如果是修改
      if (this.tableData[index] && this.tableData[index].pro) {
        this.form = JSON.parse(
          JSON.stringify(this.tableData[this.selectRow].form)
        );
      } else {
        if (this.length > 1) {
          this.form = JSON.parse(
            JSON.stringify(this.tableData[this.length - 2].form)
          );
        }
      }
      //2019年11月26日 dyp 去除根据相等的产品编码判断，只要存在'C01,C02,M01’这种编码统统带出来
      this.$nextTick(() => {
        this.$refs.proNext[0].focus()
      })
    },
    //根据编码获取产品名称
    async remoteMethod() {
      let data = await this.api.sysSearchProductNo();
      this.writeProList = data.data;
    },
    //选中产品
    choosePro(row, index) {
      if (index !== null && index !== undefined) {
        this.selectRow = index;
      }
      this.dialogShow = true;
      this.stepOne = false;
      // this.inputProNo = "";
      this.stepTwo = true;
      this.showInput = true;
      this.dialogType = 0;


      this.showFirstStep = true;
      let data = {};
      for (let [k, v] of Object.entries(this.product)) {
        if (k === "productAttributes") {
          v = [];
        } else if (k === "orderNum") {
          v = 1;
        } else {
          v = "";
        }
        data[k] = v;
      }

      this.product = data;
      this.form = {};
      this.fileList = [];

      let info = this.writeProList.find(item => item.code == this.inputProNo);
      this.product.productSku = info.code;
      this.product.productName = info.name;
      this.caseImgUrl = info.caseImgUrl;
      this.proObj = info;
      // console.log('===============')
      // console.log(info)
      this.nextStep(index)

    },
    //回车
    enterKey(event) {
      // if(this.inputType=='input'){
      //   return
      // }
      // const code = event.keyCode
      //   ? event.keyCode
      //   : event.which
      //     ? event.which
      //     : event.charCode;
      // if(code!=13){
      //   return
      // }
      //
      //
      // if (this.inputType=='next') {
      //   console.log('下一步')
      //   // this.nextStep();
      // }
      // if (this.inputType=='cancel') {
      //   console.log('取消')
      //   // this.cancel();
      // }
      // if ( this.inputType=='pre') {
      //   console.log('上一步')
      //   // this.preStep();
      // }
      // if( this.inputType == 'confirm'){
      //   console.log('确定')
      //   // this.confirmProp()
      // }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keyup", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keyup", this.enterKey);
    },
    handleClick(row, index) {
      // this.tableObj.no = this.length + 1;
      this.tableData.push(JSON.parse(JSON.stringify(this.tableObj)));
      if (this.tableData.length > 1) {
        //this.tableData[this.tableData.length-1].installSite = this.tableData[index].installSite
        this.tableData[this.tableData.length - 1].remark = this.tableData[index].remark
        //this.tableData[this.tableData.length-1].remarkProduct = this.tableData[index].remarkProduct
      }
      console.group()
      // console.log('增加信息')
      // console.log(this.tableData)
      console.groupEnd()
    },
    delet(row, index) {
      this.$confirm("此操作将删除该产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.tableData.length > 1) {
            this.tableData.splice(index, 1);
            this.cartList.splice(index, 1);
            this.until.loSave("cartList", JSON.stringify(this.cartList));
            this.until.loSave("tableData", JSON.stringify(this.tableData));
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async modify(row, index) {
      //修改，取消上一步显示
      this.showFirstStep = false;
      this.modifyProduct = true;
      this.dialogType = 1;
      await this.showDialog(row, index, "modify");
      //  this.stepTwo=true
      await this.nextStep(index);
    },
    async getProList() {
      this.proList = await this.api.getProductCatList();
    },

    async changePro(val) {
      this.product.productCatCode = val.id;
      this.product.code = val.code;
      //let e = val.id
      this.funList = await this.api.getProFunctionList({
        catId: val.id
      });

      let arr = this.proList.filter(item => item.id === val.id);
      this.product.productCatName = arr[0].name;
      this.shapeList = [];
      this.panelMaterialList = [];
      //默认带出第一个

      this.product.productFunCode = this.funList[0].code;
      this.changeFunc(this.product.productFunCode);
    },
    async changeFunc(e) {
      console.log(e)

      let arr = this.funList.filter(item => item.code === e);
      this.product.productFunName = arr[0].name;
      let param = {
        catId: this.product.productCatCode,
        funId: this.product.productFunCode
      };
      this.shapeList = await this.api.getProShapeList(param);

      this.product.productShapeCode = this.shapeList[0].code;
      this.changeShape(this.product.productShapeCode);
    },
    async changeShape(e) {
      let arr = this.shapeList.filter(item => item.code === e);
      this.product.productShapeName = arr[0].name;

      let code = `1${this.val.code}${this.product.productFunCode}${e}`;
      this.panelMaterialList = await this.api.getProPanelMaterialList({
        code
      });

      if (this.panelMaterialList) {
        this.product.panelMaterialCode = this.panelMaterialList[0].materialCode;
        this.product.panelMaterialName = this.panelMaterialList[0].materialName;
        this.getPanel(this.panelMaterialList[0].id);
      } else {
        this.product.panelMaterialCode = "";
        this.product.panelMaterialName = "";
      }
    },
    toLocalStorage() {
      this.until.loSave("tableData", JSON.stringify(this.tableData));
    },
    async getPanel(e) {

      if (e) {
        const index = this.panelMaterialList.findIndex(item => item.id === e);
        this.product.panelMaterialCode = this.panelMaterialList[
          index
          ].materialCode;
        this.product.panelMaterialName = this.panelMaterialList[
          index
          ].materialName;
        this.panelMaterialId = this.panelMaterialList[index].id;
      }

      //this.productNo = '1161110'
      // if (this.productNo.length === 6 || this.productNo.length === 7) {


      this.proObj = await this.api.getProductByMaterial(this.productNo);
      if (this.proObj) {
        this.imgUrl = this.proObj.imgUrl ? this.proObj.imgUrl : this.imgUrl;
        this.caseImgUrl = this.proObj.caseImgUrl;
        this.product.productSku = this.proObj.code;
        this.product.productName = this.proObj.name;
        this.product.productUnitCode = this.proObj.unitCode;
        this.product.productUnitName = this.proObj.unitName;
        this.product.ilikeLogUrl = this.imgUrl ? this.imgUrl : this.ilikeLog;
      }
      // }
    },
    async confirmProp() {
      //处理表单数据
      console.log('确定')
      this.proObj.attributeNm = "";
      this.product.productAttributeCode = "";
      this.product.productAttributes = [];
      let idList = [];
      const propArrLen = this.propArr.length;
      if (propArrLen > 0) {
        for (let index = 0; index < propArrLen; index++) {
          const item = this.propArr[index];
          let obj = {};

          if (!this.form[item.code]) {
            this.$message.error("您还没有填写完产品属性,不能确定！");
            return;
          }

          obj.attributeKeyCode = item.code;
          obj.attributeKeyName = item.name;

          if (item.type === 1) {
            if (this.form[item.code] < 0) {
              this.$message.error("产品的尺寸不能填写负数,请修改！");
              return;
            }
            obj.attributeValueName = this.form[item.code];
          } else {
            //需要提供必填判断？
            let valueArr = this.form[item.code].split("_");
            obj.attributeValueCode = valueArr[0];
            obj.attributeValueName = valueArr[1];
            //得到校验列表

            idList.push(valueArr[2]);
          }
          this.product.productAttributeCode += `#${obj.attributeKeyCode}#|${obj.attributeValueName}|`;
          this.product.productAttributes.push(obj);
          this.proObj.attributeNm += `${obj.attributeValueName} `;
        }
        this.val = {};
      } else {
        this.$message.error("没有属性的产品不能选择！");
        return;
      }

      //根据IdList去查
      const checkList = await this.api.getCheckRestrictionsList(idList);

      if (checkList) {
        for (let i = 0, len = checkList.length; i < len; i++) {
          const itemCheck = checkList[i];

          if (itemCheck.attributeCheckCode) {
            const valueOri = this.form[itemCheck.attributeCheckCode];
            let value = "";
            if (valueOri && valueOri.indexOf("_") > 0) {
              value = valueOri.split("_")[0];
            } else if (valueOri) {
              value = valueOri;
            } else {
              value = "";
            }

            if (
              value > itemCheck.attributeCheckMaxVal ||
              value < itemCheck.attributeCheckMinVal ||
              value === itemCheck.attributeCheckVal
            ) {
              this.$message.error(
                `您所选择的产品编码为${itemCheck.attributeCheckCode}存在约束条件，不能选择${itemCheck.attributeValNm}，请重新选择`
              );
              return;
            }
          }
        }
      }

      let filterData = this.tableData.filter(
        (item, index) => index === this.selectRow
      );
      // console.log(this.tableData)
      // console.log(filterData)
      if (Object.keys(this.proObj).length > 1) {
        filterData[0].pro = this.proObj.code;
        filterData[0].name = this.proObj.name;
        filterData[0].unit = this.proObj.unitName;
      }
      filterData[0].attribute = this.proObj.attributeNm;
      filterData[0].product = this.product;
      filterData[0].fileList = this.fileList;
      filterData[0].form = this.form;

      this.product.buyNum = 1;

      let productAttr = "";
      this.product.productAttributes.forEach(item => {
        productAttr += `${item.attributeValueName} `;
      });
      this.product.productAttr = productAttr;
      //新增push,修改不push
      if (this.cartLength > this.selectRow) {
        this.cartList[this.selectRow] = JSON.parse(
          JSON.stringify(this.product)
        );
      } else {
        this.cartList.push(JSON.parse(JSON.stringify(this.product)));
      }
      this.until.loSave("tableData", JSON.stringify(this.tableData));
      this.until.loSave("cartList", JSON.stringify(this.cartList));
      this.dialogShow = false;
      this.inputType = ''
    },
    addCart() {
      this.cartBatchVisible = true;
    },
    getDialogShow(val) {
      this.cartBatchVisible = val;
    },
    async pickBatchCertain(batch) {
      if (this.cartList.length == 0) {
        this.$message.error("您还没有添加任何产品");
        return;
      }
      let userInfo = JSON.parse(this.until.loGet("userInfo"));

      const {cartCatId, cartCatRemark} = {...batch};
      this.cartList.map((item, index) => {
        item.buyId = userInfo.userId;
        item.buyName = userInfo.realName;
        item.productUnitCode = item.unitCode;
        item.productUnitName = item.unitName;
        item.productAttributes = item.productAttributes;
        item.buyNum = this.tableData[index].count;
        item.remark = this.tableData[index].remark;
        item.installSite = this.tableData[index].installSite;
        item.remarkProduct = this.tableData[index].remarkProduct;
        item.cartCatId = cartCatId;
        item.cartCatRemark = cartCatRemark;
      });

      this.api
        .postSysBatchAddCart({jsonData: JSON.stringify(this.cartList)})
        .then(res => {
          if (res.code === 0) {
            this.$message({
              message: "加入购物车成功",
              type: "success"
            });
            //把添加成功的产品在当前购物车清空，同样需要把页面清空
            this.cartBatchVisible = false;
            this.cartList = [];
            this.tableData = [];
            this.until.loRemove("tableData");
            this.until.loRemove("cartList");
            this.tableData.splice(0, this.length, JSON.parse(JSON.stringify(this.tableObj)));
            //
            const qry = new this.Query();
            qry.buildPageClause(1, 10);

            const param = qry.getParam();
            this.api.getCartBatchListByPage(param).then(r => {
              if (r.code == 0) {
                this.store.commit("setCartNum", r.data.total);
              }
            });
          }
        });
    },
    toOrder() {
      if (this.cartList.length == 0) {
        this.$message.error("您还没有添加任何产品");
        return;
      }
      this.cartList.forEach((item, index) => {
        item.orderNum = this.tableData[index].count;
        item.remark = this.tableData[index].remark;
        item.installSite = this.tableData[index].installSite;
        item.remarkProduct = this.tableData[index].remarkProduct;
        item.buyNum = this.tableData[index].count
      });
      this.until.loSave("cartList", JSON.stringify(this.cartList));
      this.until.loRemove("tableData");
      this.$router.push("./order");
    }
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
};
</script>

<style lang="less">
@import url("../../../../assets/css/common.less");

.customize {
  width: 100%;
  padding-top: 40px;
  background-color: #fff;
  min-height: 550px;

  .el-table {
    margin: 0 auto;
    width: 1350px;
    height: auto;
    border-top: 1px solid #e1e1e1;

    input {
      height: 40px;
      line-height: 40px;
      width: 100%;
      text-align: center;
      border: 1px solid #e1e1e1;
    }

    /*height: 500px;*/

    .el-table__row {
      height: 100px;

      .proNo {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        img {
          width: 31px;
          height: 25px;
          flex: 0 0 auto;
        }

        > div {
          padding: 5px 10px;
          flex: 1;
          margin-right: 5px;
          border: 1px solid #dfdfdf;
          height: 30px;
          overflow: hidden;

          input {
            border: 0;
            height: 20px;
            line-height: 20px;
            background: none;
            padding: 0;
          }

          .el-input {
            display: flex;
            display: -webkit-flex;

            input {
              flex: 1;
              text-align: left;

            }
          }

          .el-input__icon {
            line-height: 20px;
          }
        }
      }
    }

    .cell {
      text-overflow: clip;
    }

    textarea {
      width: 138px;
      height: 80px;
    }
  }

  .operate {
    width: 1200px;
    margin: 40px auto;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    justify-content: flex-end;

    .btn {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      width: 30%;

      button {
        width: 40%;
        height: 40px;
        border: 1px solid @btnColor;
        border-radius: 4px;
        background-color: #fff;
        color: @btnColor;
        text-align: center;
        line-height: 40px;
        font-size: 18px;

        &:nth-last-of-type(1) {
          background-color: @btnColor;
          color: #fff;
        }
      }
    }
  }

  .case-img {
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .blur {
    background-color: #666666 !important;
    border-color: #666666 !important;
    color: #ffffff !important;
  }
}
</style>
