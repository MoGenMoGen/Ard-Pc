<template>
  <div id="main" style="height: 479px; width: 100%"></div>
</template>

<script>
export default {
  data() {
    return {
      //   height: 0,
      myChart: null,
      dimensions: [
        // "product",
        // "累计订单总额:7000元",
        // "本年度订单总额：7000",
        // "本年度已完成订单总额：0",
      ],
      source: [
        // [
        //   "product",
        //   "累计订单总额:7000元",
        //   "本年度订单总额：7000",
        //   "本年度已完成订单总额：0",
        // ],
        // ["Matcha Latte", 43.3, 85.8, 93.7],
        // ["Milk Tea", 83.1, 73.4, 55.1],
        // ["Cheese Cocoa", 86.4, 65.2, 82.5],
        // ["Walnut Brownie", 72.4, 53.9, 39.1],
      ],
    };
  },

  async mounted() {},
  methods: {
    setHeight(data) {
      this.height = data + "px";
    },
    getData(data) {
      console.log("重新赋值", data);
      this.source = data;
      //   this.nameList = [];
      //   this.dataList = [];
      //   data.forEach((item) => {
      //     this.nameList.push(item.catName);
      //     this.dataList.push(item.catTotalAmount);
      //   });
      this.init();
    },
    init() {
      this.myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        legend: {
          //  itemWidth : 50
        },
        tooltip: {},
        dataset: {
          //   dimensions: this.dimensions,
          source: this.source,
        },
        // xAxis: { type: "category" },
        xAxis: [
          {
            type: "category",
            //data: ['2015-2016', '2016-2017', '2017-2018', '2018-2019']
            axisLabel: {
              interval: 0, //强制文字产生间隔
              rotate: 45, //文字逆时针旋转45°
              textStyle: {
                //文字样式
                color: "black",
                fontSize: 16,
                fontFamily: "Microsoft YaHei",
              },
            },
          },
        ],
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: "#5470C6",
              },
            },
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: "#91CC75",
              },
            },
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: "#FAC858",
              },
            },
          },
        ],
        // grid: {
        //   //   top: "10",
        //   //   left: "10",
        //   //   right: "20",
        //   //   bottom: "10",
        // },
        grid: {
          // 控制图的大小，调整下面这些值就可以，
          x: 100, //控制x轴文字与底部的距离
          y2: 100, // y2可以控制倾斜的文字狱最右边的距离，放置倾斜的文字超过显示区域
        },
      };
      this.myChart.setOption(option);
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
#main {
  width: 240px;
  /*height: 270px;*/
  margin: 20px auto 0;
}
</style>
