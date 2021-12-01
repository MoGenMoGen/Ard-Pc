<template>
  <div class="pro-list">
    <div class="pro-item" v-for="(item, index) in projectList" :key="index">
      <img @click="changeStatus(item,index)" :src="item.checked?pick:notpick" alt />
      <div class="pro-content">
        <div>
          <span>所在区域：</span>
          <span>{{item.projectAreaName}}</span>
        </div>
        <div>
          <span>经销商名称：</span>
          <span>{{item.saleName}}</span>
        </div>
        <div>
          <span>项目负责人：</span>
          <span>{{item.projectLeader}}</span>
        </div>
        <div>
          <span>联系电话：</span>
          <span>{{item.leaderLinkPhone}}</span>
        </div>
        <div>
          <span>工程名称：</span>
          <span>{{item.projectName}}</span>
        </div>
        <div>
          <span>报备时间：</span>
          <span>{{item.reportTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import pick from "../images/circle_pick.png";
import notpick from "../images/circle_notpick.png";

export default {
  props: {
    projectList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      pick,
      notpick
    };
  },
  methods: {
    changeStatus(item, index) {
      item.checked = !item.checked;
      //其他的也设置为false
      let filter = this.projectList.filter(itemPro => itemPro !== item);
      filter.map(item => (item.checked = false));
      this.$set(this.projectList, index, item);
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.pro-list {
  .pro-item {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    align-items: center;
    border-top: 1px solid #dfdfdf;
    padding: 20px 0;
    img {
      width: 29px;
      height: 29px;
    }
    div {
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      margin-left: 10px;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;

        &:not(:nth-last-of-type(1)) {
          margin-bottom: 10px;
        }
        span {
          &:nth-last-of-type(1) {
            margin-left: 30px;
          }
        }
      }
    }
  }
}
</style>
