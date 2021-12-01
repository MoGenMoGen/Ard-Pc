<template>
  <el-dialog
    title="修改意向订单名称"
    :visible="cartBatchVisible"
    @close="closeBatchShow"
    width="50%"
    :close-on-click-modal="false"
  >
    <div class="batch-sel">
      <div>
        <span>批次名称：</span>
        <el-input placeholder="请输入批次备注" v-model="batchRemark"></el-input>
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
    id: {
      type: Number,
      default: 0
    },
    cartBatchVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      batchRemark: ""
    };
  },
  watch: {
    id(val) {
      this.getBatchCartInfo();
    }
  },
  methods: {
    certain() {
      this.$emit("pickBatchCertain", this.batchRemark);
    },
    closeBatchShow() {
      this.$emit("changeBatchDialog", false);
    },
    async getBatchCartInfo() {
      const res = await this.api.getBatchRemarkAccordingToId(this.id);
      this.batchRemark = res.crmCartCatVo.remark;
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
