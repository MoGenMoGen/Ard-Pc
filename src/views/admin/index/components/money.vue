<template>
  <div id="money" :style="{height:height}">

  </div>
</template>

<script>
  export default {
    data() {
      return {
        height:0,
        myChart:null,
        name:'定制类型金额统计',
        typeList:['定制','艺术定制','专属定制'],
        dataList:[
          {value:335, name:'定制'},
          {value:310, name:'艺术定制'},
          {value:234, name:'专属定制'},
        ],
        colorList:['#37A2DA','#67E0E3','#FFDB5C']
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
            value:item.value
          }
          if(item.id===1){
            param.name = '定制'
          }
          if(item.id===2){
            param.name = '艺术定制'
          }
          if(item.id===3){
            param.name = '专属定制'
          }

          this.typeList.push(param.name)
          this.dataList.push(param)

        })
        this.init()
      },
      init(){
        console.log('init2222222222');
        this.myChart = this.$echarts.init(document.getElementById('money'))

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
              width:'auto',
              center: ['50%', '50%'],
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
  #money{
    width:100%;
    /*height: 270px;*/
    // margin: 20px auto 0;
    padding: 0;
    border: 0;
  }
</style>

