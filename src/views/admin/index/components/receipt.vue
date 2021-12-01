<template>
  <div id="receipt" :style="{height:height}">

  </div>
</template>

<script>
  export default {
    data() {
      return {
        height:0,
        myChart:null,
        name:'接单额区域占比',
        typeList:['华中','西南','华北','东北','华南'],
        dataList:[
          {value:335, name:'华中'},
          {value:310, name:'西南'},
          {value:234, name:'华北'},
          {value:135, name:'东北'},
          {value:1548, name:'华南'}
        ],
        colorList:['#37A2DA','#67E0E3','#FFDB5C','#FF9F7F','#E062AE']
      };
    },

    mounted() {
      // console.log(this.list)
      // this.list.forEach((item,index)=>{
      //   this.typeList.push(item.bigRegionId)
      // })
      // this.init()

    },
    methods: {
      setHeight(data){
        this.height = data+'px'
      },
      getData(data){
        this.typeList = []
        this.dataList = []
        data.forEach(item=>{
          let param = {
            name:'',
            value:item.bigRegionCount
          }
          if(item.bigRegionId===1){
            param.name = '东北'
          }
          if(item.bigRegionId===2){
            param.name = '华北'
          }
          if(item.bigRegionId===3){
            param.name = '华东'
          }
          if(item.bigRegionId===4){
            param.name = '华中'
          }
          if(item.bigRegionId===5){
            param.name = '华南'
          }
          if(item.bigRegionId===6){
            param.name = '西南'
          }
          if(item.bigRegionId===7){
            param.name = '西北'
          }
          this.typeList.push(param.name)
          this.dataList.push(param)

        })
        this.init()
      },
      init(){
        this.myChart = this.$echarts.init(document.getElementById('receipt'))

        var option = {

          textStyle: {
            color: '#ffffff'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.typeList,
            textStyle:{
              color:'#fff',
              fontSize: 12,
            }
          },
          series : [
            {
              name: this.name,
              type: 'pie',
              radius : '36%',
              center: ['65%', '60%'],
              data:this.dataList,
              color: this.colorList,
              labelLine: {
                normal: {
                  show: true   // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              },
              label: {
                normal: {
                  position: 'outer',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                  // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                  // {a}指series.name  {b}指series.data的name
                  // {c}指series.data的value  {d}%指这一部分占总数的百分比
                  formatter: '{b}'
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
  #receipt{
    width: 240px;
    /*height: 270px;*/
    margin: 20px auto 0;
  }
</style>
