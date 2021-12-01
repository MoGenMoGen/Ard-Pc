<template>
  <el-dialog
    title="付款明细"
    :visible="payLogVisible"
    @close="closePayLogShow"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="payName" label="支付人" width="180"></el-table-column>
      <el-table-column prop="orderAmount" label="应付金额" width="180"></el-table-column>
      <el-table-column prop="payAmount" label="支付金额" width="180"></el-table-column>
      <el-table-column prop="payDate" label="支付日期" width="180"></el-table-column>
    </el-table>
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
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    payLogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: [],
      pageNum: 1,
      total: 0,
      pageSize: 10
    };
  },
  watch: {
    id(val) {
      this.getPayDetail();
    }
  },
  mounted() {
    // this.getPayDetail();
  },
  methods: {
    async getPayDetail() {
      const qry = new this.Query();
      qry.buildWhereClause("orderId", this.id, "EQ");

      const param = qry.getParam();
      const res = await this.api.getPayListAccordingToOrderNo(param);
      const { data, page } = { ...res };
      this.tableData = data.list.map(item => item.crmPayInfoVo);
      this.tableData.map(item=>{
        item.orderAmount=`￥${item.orderAmount}`
        item.payAmount=`￥${item.payAmount}`
      })
      this.total = page.total;
    },
    closePayLogShow() {
      this.$emit("closePayLog", false);
    },
    async handleCurrentChange(e) {
      this.pageNum = e;
      this.getPayDetail();
    },
    async handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getPayDetail();
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.footer1{
  padding: 20px 0;
}
</style>
