<template>
  <div id="app">
    <div class="yearChoose">
      <el-select v-model="currentYear" @change="yearCh" placeholder="请选择">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="currentMonth" placeholder="选择月份" clearable >
        <el-option
          v-for="item in monthList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <h3>埃瑞德销售驾驶舱</h3>
    <div class="row">
<!--       <div class="left">
         <p class="title">本年度报备统计</p>
         <div>
           <p>报备笔数：<span class="red">{{info.reportCount}}</span>笔</p>
           <p>报备金额：<span class="blue">{{info.reportMoney}}</span>万</p>
         </div>
         <div class="yellow">
           <p><span>报备基数：</span>{{info.reportBaseCount}}</p>
           <p><span>新增项目：</span>{{info.newReportProjectCount}}</p>
           <p><span>已送样/已做样板房：</span>{{info.sampleDeliveredCount}}</p>
           <p><span>已成交总数：</span>{{info.completedReportCount}}</p>
           <p><span>总报备数量：</span>{{info.allReporCount}}</p>
           <p><span>成交率：</span>{{info.turnoverRateStr}}</p>
         </div>
       </div> -->
       <div class="left">
         <p class="title">定制类型金额统计</p>
         <div>
           <p>定制：<span class="white">{{info.reportCount}}</span>万</p>
           <p>艺术定制：<span class="white">{{info.reportMoney}}</span>万</p>
           <p>专属定制：<span class="white">{{info.reportMoney}}</span>万</p>
         </div>
         <div class="chart">
        <money ref="money"></money>
         </div>
       </div>
      <div class="center" ref="center">
        <div class="totalData">
          <p>销售计划<span class="yellow">{{info.allYearPlanSaleCount}}万</span></p>
          <span></span>
          <p>实际接单额<span class="yellow">{{info.allYearAcutalSaleCount}}万</span></p>
          <span></span>
          <p>出货额<span class="yellow">{{info.shipmentCount}}万</span></p>
          <span></span>
          <p>完成率<span class="yellow">{{info.completionRateStr}}</span></p>
        </div>
        <br>
        <div class="totalData">
          <p>工程接单额/出货额（万）<span class="yellow">{{info.xmOrderSum}} / {{info.xmOutOrderSum}}</span></p>
          <!--<span></span>-->
          <!--<p>工程出货额<span class="yellow">{{info.xmOutOrderSum}}万</span></p>
          <span></span>-->
          <p>零售接单额/出货额（万）<span class="yellow">{{info.notXmOrderSum}} / {{info.notXmOutOrderSum}}</span></p>
          <!--<span></span>-->
         <!-- <p>零售出货额<span class="yellow">{{info.notXmOutOrderSum}}万</span></p>-->
        </div>
        <div class="map">
          <map-data></map-data>
        </div>
      </div>
      <div class="right">
        <p class="title">区域报备排行</p>
        <ul>
          <li v-for="(item,index) in info.regionReportRankingList" :key="index" v-if="index<6">
            <span :class="{yellowBg:index<3,blueBg:index>=3}">{{index+1}}</span>
            <p>{{item.provincename}}</p>
            {{item.provincecount}} 笔
          </li>
        </ul>
        <p class="title">经销商报备排行</p>
        <ul>
          <li v-for="(item,index) in info.agentReportRankingList" :key="index" v-if="info.agentReportRankingList.length>0 && index<6">
            <span :class="{yellowBg:index<3,blueBg:index>=3}">{{index+1}}</span>
            <p :title="item.corpName" v-if="item.corpName.length>9">{{item.corpName.slice(0,9)}}...</p>
            <p :title="item.corpName" v-else>{{item.corpName}}</p>
            {{item.agentreportcount}} 笔
          </li>
        </ul>
      </div>
    </div>
    <div class="echarts" ref="echarts">
      <div class="left">
        <p class="title">产品线销售额排名</p>
        <product ref="product"></product>
      </div>
      <div class="center">
        <p class="title">各省销售额统计</p>
        <province ref="province"></province>
      </div>
      <div class="right">
        <p class="title">接单额区域占比</p>
        <receipt ref="receipt"></receipt>
      </div>
    </div>
  </div>
</template>

<script>
import product from './components/product'
import mapData from './components/mapData'
import province from './components/province'
import receipt from './components/receipt'
import money from './components/money'
export default {
  data() {
    return {
      currentMonth:'',
      monthList:[],
      height:0,
      yearList:[],
      startYear:2019,
      info:{},
      list:[{
        nm:'上海',
        num:1200
      },{
        nm:'上海2',
        num:1200
      },{
        nm:'上海3',
        num:1200
      },{
        nm:'上海4',
        num:1200
      },{
        nm:'上海5',
        num:1200
      },{
        nm:'上海6',
        num:1200
      }],
      currentYear:0,
    };
  },
  watch:{
    currentYear:function (e) {
      this.getData(e,this.currentMonth)
    },
    currentMonth:function (e) {
      this.getData(this.currentYear,e)
    }
  },
  mounted() {
    let year = new Date().getFullYear()
    this.currentYear = year
    // this.getData(year)
    for(let i=this.startYear;i<=year;i++){
      this.yearList.push(i)
    }
    let da = new Date
    let month = da.getMonth()+1;
    for(let i=1;i<=month;i++) {
      this.monthList.push(i)
    }
    this.$nextTick(()=>{
      console.log(this.$refs.echarts.offsetHeight)
      let height = this.$refs.echarts.offsetHeight - 80
      this.$refs.money.setHeight(height)
      this.$refs.receipt.setHeight(height)
      this.$refs.product.setHeight(height)
      this.$refs.province.setHeight(height)
    })
  },
  methods: {
    getData(year,month){

      this.api.adminData({year:year,month:month}).then(res=>{
        if(res.code === 0){
          this.info = res.data
          let list=[
            {name:'定制',
            id:1,
            value:1},
            {name:'艺术定制',
            id:2,
            value:2},
            {name:'专属定制',
            id:3,
            value:3},
          ]
          this.$refs.money.getData(list)
          this.$refs.receipt.getData(this.info.bigRegionCountList)
          this.$refs.product.getData(this.info.catTotalAmountList)
          this.$refs.province.getData(this.info.provinceTotalAmountList)
        }
      })
    },
    yearCh(year) {
      let nowYear = (new Date()).getFullYear()
      this.currentMonth = ''
      this.monthList = []
      if(nowYear == year){
        let da = new Date
        let month = da.getMonth()+1;
        for(let i=1;i<=month;i++) {
          this.monthList.push(i)
        }
      } else {
        this.monthList = [1,2,3,4,5,6,7,8,9,10,11,12]
      }
    }
  },
  components: {
    mapData,
    product,
    province,
    receipt,
    money
  }
};
</script>
<style lang="less">
  html,
  body {
    height: 100%;
    width: 100%;
  }
  .yearChoose{
      input{
        background: #151D20!important;
        color: #ffffff;
        border: 1px solid #51555B;
      }
  }
</style>

<style lang='less' scoped>
html,
body {
  height: 100%;
  width: 100%;
  @yellow:#FAED29;
  @red:#E690D1;
  @blue:#32C5E9;
  #app {
    width: 100%;
    height: 100%;
    min-height: 900px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    min-width: 1200px;
    background: #151D20!important;
    color: #ffffff;
    position: relative;
    .yearChoose{
      position: absolute;
      right: 20px;
      top:10px;
    }
    h3{
      text-align: center;
      font-size: 28px;
      padding-top: 25px;
      padding-bottom: 28px;
    }
    .yellow{
      color: @yellow;
    }
    .red{
      color: @red;
    }
    .white{
      color:white;
    }
    .blue{
      color: @blue;
    }
    .yellowBg{
      background: @yellow;
    }
    .blueBg{
      background: @blue;
    }
    .row,.echarts{
      width: 100%;
      display: flex;
      display: -webkit-flex;

      .center{
        flex: 1;
      }
      .left{
        margin-left: 20px;
        width: 300px;
        border-radius: 6px;
        background: rgba(63,116,185,0.1);
        border: 1px solid #51555B;
      }
      .right{
        border-radius: 6px;
        background: rgba(63,116,185,0.1);
        border: 1px solid #51555B;
        margin-right: 20px;
        width: 240px;
      }
      .title{
        font-size: 18px;
        text-align: center;
        padding-top: 21px;
      }
    }
  }
}
.row{
  .left{
    height: 460px;
    >div{
      margin-left: 23px;
    }
    div:first-of-type{
      padding-top: 30px;
      padding-bottom: 22px;
      margin-bottom: 21px;
      border-bottom: 1px solid transparent;
      border-color: transparent;
      border-color: rgba(255,255,255,0.1);
      margin-right: 30px;
      p{
        line-height: 39px;
        span{
          font-size: 22px;
          display: inline-block;
          padding-left: 12px;
          padding-right: 10px;
        }
      }
    }
    div:last-of-type{
      p{
        font-size: 22px;
        line-height: 38px;
        span{
          color: #ffffff;
          width: 132px;
          display: inline-block;
          font-size: 14px;
        }
      }
    }
    .chart{
      padding: 0;
      border: 0;
    }
  }
  .center{
    flex: 1;

    .totalData{
      width: 100%;
      text-align: center;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      >span{
        display: block;
        height: 30px;
        width: 1px;
        background: #8595AA;
      }
      p{
        flex: 1;
        color: #ffffff;
        span{
          display: block;
          font-size: 22px;
          margin-top: 10px;
        }
      }
    }
  }
  .right{
    height: 460px;
    ul{
      padding-left: 32px;
      padding-right: 30px;
      padding-top: 10px;
      li{
        display: flex;
        display: -webkit-flex;
        padding-top: 15px;
        align-items: center;
        line-height: 16px;
        span{
          width: 16px;
          height: 16px;
          display: block;
          border-radius: 100%;
          color: #333333;
          text-align: center;
          line-height: 16px;
          font-size: 12px;
          margin-right: 8px;
        }
        p{
          width: 90px;
          overflow: hidden;
          height: 16px;
          padding-right: 8px;
        }
      }
    }
    ul:first-of-type{
      padding-bottom: 15px;
    }
    ul:last-of-type{
      padding-left: 16px;
      padding-right: 16px;
      font-size: 13px;
      li{
        display: flex;
        display: -webkit-flex;
        padding-top: 6px;
        align-items: center;

        p{
          width: 130px;
        }
      }
    }
  }

}
.echarts{
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  .center{
    border-radius: 6px;
    background: rgba(63,116,185,0.1);
    border: 1px solid #51555B;
    margin: 0 18px;
  }
}
</style>
