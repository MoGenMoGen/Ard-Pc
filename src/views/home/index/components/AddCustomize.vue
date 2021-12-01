<template>
  <el-dialog title="增加定制产品" :visible.sync="customizeDialog" :close-on-click-modal="false" append-to-body>
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
          @change="choosePro"
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
      </div>
      <div class="select-pro" v-else>
        <div>
          <div class="selector">
            <div>
              <span>系列：</span>
              <el-select v-model="product.productCatCode" placeholder="请选择" @change="changePro">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </div>
            <div>
              <span>功能：</span>
              <el-select v-model="product.productFunCode" placeholder="请选择" @change="changeFunc">
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
              <el-select v-model="product.productShapeCode" placeholder="请选择" @change="changeShape">
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
              <el-select v-model="panelMaterialId" placeholder="请选择" @change="getPanel">
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
                <img :src="product.ilikeLogUrl" alt />
              </div>
            </div>
          </div>
        </div>
        <div v-if="showUpload">
          <span>形状图片:</span>
          <el-upload
            class="upload-demo"
            action="/general/oss/upload"
            :multiple="true"
            :before-remove="beforeRemove"
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="afterSuccess"
            accept=".dwg, .jpg, .jpeg, .png, .pdf, .bmp"
          >
            <el-button size="medium" type="warning">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
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
        <img :src="caseImgUrl" @click="triggerZoom" alt />
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
                <input type="number" min="0" v-model="form[`${item.code}`]" />
              </div>
              <!-- 需要动态绑定每个选项的值 -->
              <el-select
                v-model="form[`${item.code}`]"
                @change="changeAttrVal(item.code,itemProp.code)"
                v-else
                placeholder="请选择"
              >
                <el-option
                  v-for="itemChild in item.attribueValueList"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="
                      itemChild.code + '_' + itemChild.name + '_' + itemChild.id
                    "
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <span style="margin: 3% 0 0 10%;">订单数量：</span>
      <el-input-number v-model="product.orderNum"  :min="0"></el-input-number>
      <div class="first-upload">
        <span>附件:</span>
        <el-upload
          class="upload-demo"
          action="/general/oss/upload"
          :multiple="true"
          :before-remove="beforeRemove1"
          :limit="5"
          :on-exceed="handleExceed1"
          :file-list="fileList1"
          :on-success="afterSuccess1"
          accept=".dwg, .jpg, .jpeg, .png, .pdf, .bmp"
        >
          <el-button size="medium" type="warning">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
    </div>
    <!-- footer -->
    <div slot="footer" class="operate-footer" :class="{ 'center-btn': showInput === true }">
      <div class="btn" v-if="stepOne === true && !stepTwo">
        <button @click="cancel">取消</button>
        <button @click="nextStep">下一步</button>
      </div>
      <div class="btn-two" v-if="stepTwo === true">
        <div class="second-btn">
          <button @click="preStep">上一步</button>
          <button @click="cancel">取消</button>
          <button @click="confirmProp">确认</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    customizeDialog: {
      type: Boolean,
      default: false
    },
    writeProList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showInput: true,
      stepOne: true,
      stepTwo: false,
      showInput: true,
      inputProNo: "",
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
        shapeRemark: ""
      },
      proList: [],
      funList: [],
      shapeList: [],
      panelMaterialList: [],
      showUpload: false,
      showUpload2: false,
      fileList: [],
      caseImgUrl: "",
      showCaseImg: false,
      stepArr: [],
      form: {},
      proObj: {}
    };
  },
  methods: {
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleExceed1(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    afterSuccess(response, file, fileList) {
      this.product.shapeImgUrl = this.product.shapeImgUrl
        ? `${this.product.shapeImgUrl},${response.data}`
        : response.data;
      this.product.shapeRemark = this.product.shapeRemark
        ? `${this.product.shapeRemark},${file.name}`
        : file.name;
    },
    afterSuccess1(response, file, fileList) {
      this.product.shapeImgUrl = this.product.shapeImgUrl
        ? `${this.product.shapeImgUrl},${response.data}`
        : response.data;
    },
    changeAttrVal(code, parCode) {
      const val = this.form[`${code}`];
      const arr = val.match(/[\u4E00-\uFA29]/g);
      const arrVal = arr && arr.length > 0 ? arr.join("") : "";
      if (arrVal === "定制" && parCode === "panelPattern") {
        this.showUpload2 = true;
      } else {
        this.showUpload2 = false;
      }
    },
    preStep() {
      this.stepTwo = false;
    },
    cancel() {
      this.$emit("changeDialog", false);
      this.product.shapeRemark = "";
      this.product.shapeImgUrl = "";
      this.showUpload = false;
      this.showUpload2 = false;
      this.proObj = {};
    },
    //选中产品
    choosePro(e) {
      let info = this.writeProList.find(item => item.code == this.inputProNo);
      this.product.productSku = info.code;
      this.product.productName = info.name;
      this.caseImgUrl = info.caseImgUrl;
      this.proObj = { ...info };
    },
    async nextStep(index = 0) {
      if (this.showInput && !this.inputProNo) {
        //第一步是填写编号，但是并没有填写时提示
        this.$message("请输入商品编码选择商品");
        return;
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
      }

      //判断附件是否上传
      if (this.showUpload) {
        if (!this.product.shapeImgUrl) {
          this.$message("您还没有上传附件");
        }
      }
      this.stepTwo = true;
      this.modifyProduct = false;
      //新增
      const proNo = this.inputProNo || this.proObj.code;

      this.stepArr = await this.api.getProductAttributeByProNo(proNo);

      this.propArr = [];
      this.stepArr.map(item => {
        item.children.map(itemChild => {
          this.propArr.push(itemChild);
        });
      });

      let proCode = this.proObj.code || this.inputProNo;

      //2019年11月26日 dyp 去除根据相等的产品编码判断，只要存在'C01,C02,M01’这种编码统统带出来
    },
    async confirmProp() {
      //处理表单数据

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

      this.product.buyNum = 1;

      let productAttr = "";
      this.product.productAttributes.forEach(item => {
        productAttr += `${item.attributeValueName} `;
      });
      this.product.productAttr = productAttr;

      //提交到orderList
      this.$emit("submitAddItem", this.product);
      this.$emit("changeDialog", true);
    },
    triggerZoom() {
      const obj = {
        caseImg: true,
        url: this.caseImgUrl
      };
      this.$emit("showCaseImgOp", obj);
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
@import url("../../../../assets/css/common.less");
</style>
