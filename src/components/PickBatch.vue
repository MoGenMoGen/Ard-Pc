<template>
  <el-dialog
    title="选择意向订单"
    :visible="cartBatchVisible"
    @close="closeBatchShow"
    width="50%"
    :close-on-click-modal="false"
  >
    <div class="batch-sel">
      <div>
        <span>选择已有：</span>
        <el-select v-model="batch.cartCatId" @change="changeCart" @focus="getBatchList()" :clearable="true" placeholder="请选择已有意向订单">
          <el-option
            v-for="item in cartBatchList"
            :key="item.id"
            :label="item.remark+','+item.catOrderCode"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>新增意向订单：</span>
        <el-input placeholder="请输入意向订单备注" v-model="batch.cartCatRemark"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeBatchShow">取 消</el-button>
      <el-button type="primary" @click="certain">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    cartBatchVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cartBatchList: [],
      batch: {
        cartCatId: "",
        cartCatRemark: ""
      }
    };
  },
  watch: {
    "batch.cartCatRemark"(val) {
      if (val) {
        this.batch.cartCatId = "";
      }
    }
  },
  mounted() {
    this.getBatchList();
  },
  methods: {
    certain() {
      this.$emit("pickBatchCertain", this.batch);
      this.batch.cartCatId = "";
      this.batch.cartCatRemark = "";
    },
    closeBatchShow() {
      this.batch.cartCatId = "";
      this.batch.cartCatRemark = "";
      this.$emit("changeBatchDialog", false);
    },
    async getBatchList() {
      this.cartBatchList = await this.api.getAllBatchDataByList();
    },
    changeCart(e) {
      this.batch.cartCatRemark = "";
      this.batch.cartCatId = e;
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.batch-sel {
  display: flex;
  display: -webkit-flex;
  flex-flow: column wrap;
  > div {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    &:not(:nth-last-of-type(1)) {
      margin-bottom: 20px;
    }
    > span {
      width: 120px;
    }
    .el-select,
    .el-input {
      width: 300px;
    }
  }
}
</style>
