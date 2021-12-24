<template>
  <div id="main" :style="{height:height}">

  </div>
</template>

<script>

  export default {
    data() {
      return {
        height:0,
        myChart:null,
        nameList:['巴西','印尼','美国','印度','中国','世界人口(万)','中国','中国'],
        dataList:[1820, 2348, 2903, 8497, 1744, 230,235,6302]
      };
    },

    mounted() {
    },
    methods: {
      setHeight(data){
        this.height = data+'px'
      },
      getData(data){
        console.log('重新赋值',data)
        this.nameList = []
        this.dataList = []
        data.forEach(item=>{
          this.nameList.push(item.catName)
          this.dataList.push(item.catTotalAmount)
        })
        this.init()
      },
      init(){
        console.log('重新渲染')
        this.myChart = this.$echarts.init(document.getElementById('main'))
        var option = {

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // type: 'shadow'
            }
          },
          // legend: {
          //   data: ['2011年', '2012年']
          // },
          grid: {
            top:'8%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },

          textStyle: {
            color: '#ffffff'
          },
          itemStyle: {
            // 点的颜色。
            color: '#8378EA',
            width:1
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0,0.01],
            splitNumber:3,
            // interval:5000,
            splitLine:{
              lineStyle:{
                width:1,
                color:'#ffffff',
                opacity:0.1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: this.nameList,
          },
          series: [
            {
              // name: '2011年',
              type: 'bar',
              data: this.dataList,
              barWidth:10,

            },
          ]
        };
        this.myChart.setOption(option);
      }
    },
    components: {}
  };
</script>

<style lang="less" scoped>
#main{
  width: 240px;
  /*height: 270px;*/
  margin: 20px auto 0;
}
</style>
