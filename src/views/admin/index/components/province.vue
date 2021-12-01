<template>
  <div id="province" :style="{height:height}">

  </div>
</template>

<script>
  export default {
    data() {
      return {
        height:0,
        myChart:null,
        resizeTimer:null,
        dataAxis : ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触'],
        data : [220, 182, 191, 234, 290, 330, 310, 123, 442, 321],
        dataShadow : [],
      };
    },

    mounted() {
      let _this = this
      window.addEventListener('resize', function () {
        if (_this.resizeTimer) clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(function () {
          _this.myChart.resize();
        }, 100)
      })

    },
    methods: {
      setHeight(data){
        this.height = data+15+'px'
      },
      getData(data){
        this.dataAxis = []
        this.data = []
        data.forEach(item=>{
          this.dataAxis.push(item.provinceName)
          this.data.push(item.provinceTotalAmount)
        })
        console.log(this.data)
        this.init()
      },
      init(){
        this.myChart = this.$echarts.init(document.getElementById('province'))
        var start = this.dataAxis.length - 10
        var end = this.dataAxis.length - 1
        let option = {
          // tooltip:{},  //鼠标放上去显示数据
          grid: {
            top:'8%',
            left: '3%',
            right: '3%',
            bottom: '18%',
            containLabel: true
          },
          xAxis: {
            data: this.dataAxis,
            axisLabel: {
              interval:0,
              rotate:30,
              // inside: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            splitLine:{
              lineStyle:{
                width:1,
                color:'#ffffff',
                opacity:0.1
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {

              textStyle: {
                color: '#ffffff'
              }
            }
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              startValue: 0,
              endValue: 9,

              textStyle:{
                color: '#ffffff'
              }
            }

          ],
          series: [
            { // For shadow
              type: 'bar',
              itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
              },
              barGap:'-100%',
              barCategoryGap:'40%',
              data: this.dataShadow,
              animation: false
            },
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#60AFF4'
                },

              },
              label: {  //柱状图最上面显示数据
                normal: {
                  show: true,
                  position: 'top',
                  color: '#ffffff'
                }
              },
              data: this.data,
              barWidth:17,
            }
          ]
        };
        this.myChart.setOption(option);
      }
    },
    components: {}
  };
</script>

<style lang="less" scoped>
  #province{
    width: 100%;
    margin: 20px auto 0;
    /*height: 270px;*/
  }
</style>
