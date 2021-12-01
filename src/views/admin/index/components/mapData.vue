<template>
  <div id="map">

  </div>
</template>

<script>
  export default {
    data() {
      return {
        myChart:null,
        resizeTimer:null,
        mapName : 'china',
        province:["北京","天津","上海","重庆","河北","河南","云南","辽宁","黑龙江","湖南","安徽","山东","新疆","江苏","浙江","江西","湖北","广西","甘肃","山西","内蒙古","陕西","吉林","福建","贵州","广东","青海","西藏","四川","宁夏","海南","台湾","香港","澳门"],
        dataList : [
          {name:"北京",value:100},
          {name:"天津",value:100},
          {name:"河北",value:100},
          {name:"山西",value:100},
          {name:"内蒙古",value:100},
          {name:"辽宁",value:100},
          {name:"吉林",value:100},
          {name:"黑龙江",value:100},
          {name:"上海",value:100},
          {name:"江苏",value:100},
          {name:"浙江",value:100},
          {name:"安徽",value:100},
          {name:"福建",value:100},
          {name:"江西",value:100},
          {name:"山东",value:100},
          {name:"河南",value:100},
          {name:"湖北",value:100},
          {name:"湖南",value:100},
          {name:"重庆",value:100},
          {name:"四川",value:100},
          {name:"贵州",value:100},
          {name:"云南",value:100},
          {name:"西藏",value:100},
          {name:"陕西",value:100},
          {name:"甘肃",value:100},
          {name:"青海",value:100},
          {name:"宁夏",value:100},
          {name:"新疆",value:100},
          {name:"广东",value:100},
          {name:"广西",value:100},
          {name:"海南",value:100},
        ],

        geoCoordMap : {},
        toolTipData : [
          {name:"北京",
            value:[{name:"科技人才总数",value:95},{name:"理科",value:82}]},
          {name:"天津",value:[{name:"文科",value:22},{name:"理科",value:20}]},
          {name:"河北",value:[{name:"文科",value:60},{name:"理科",value:42}]},
          {name:"山西",value:[{name:"文科",value:40},{name:"理科",value:41}]},
          {name:"内蒙古",value:[{name:"文科",value:23},{name:"理科",value:24}]},
          {name:"辽宁",value:[{name:"文科",value:39},{name:"理科",value:28}]},
          {name:"吉林",value:[{name:"文科",value:41},{name:"理科",value:41}]},
          {name:"黑龙江",value:[{name:"文科",value:35},{name:"理科",value:31}]},
          {name:"上海",value:[{name:"文科",value:12},{name:"理科",value:12}]},
          {name:"江苏",value:[{name:"文科",value:47},{name:"理科",value:45}]},
          {name:"浙江",value:[{name:"文科",value:57},{name:"理科",value:57}]},
          {name:"安徽",value:[{name:"文科",value:57},{name:"理科",value:52}]},
          {name:"福建",value:[{name:"文科",value:59},{name:"理科",value:57}]},
          {name:"江西",value:[{name:"文科",value:49},{name:"理科",value:42}]},
          {name:"山东",value:[{name:"文科",value:67},{name:"理科",value:52}]},
          {name:"河南",value:[{name:"文科",value:69},{name:"理科",value:68}]},
          {name:"湖北",value:[{name:"文科",value:60},{name:"理科",value:56}]},
          {name:"湖南",value:[{name:"文科",value:62},{name:"理科",value:52}]},
          {name:"重庆",value:[{name:"文科",value:47},{name:"理科",value:44}]},
          {name:"四川",value:[{name:"文科",value:65},{name:"理科",value:60}]},
          {name:"贵州",value:[{name:"文科",value:32},{name:"理科",value:30}]},
          {name:"云南",value:[{name:"文科",value:42},{name:"理科",value:41}]},
          {name:"西藏",value:[{name:"文科",value:5},{name:"理科",value:4}]},
          {name:"陕西",value:[{name:"文科",value:38},{name:"理科",value:42}]},
          {name:"甘肃",value:[{name:"文科",value:28},{name:"理科",value:28}]},
          {name:"青海",value:[{name:"文科",value:5},{name:"理科",value:5}]},
          {name:"宁夏",value:[{name:"文科",value:10},{name:"理科",value:8}]},
          {name:"新疆",
            value:[
              [{name:"文科",value:36,unit:"个"},{name:"占比",value:"10%",unit:""}],
              [{name:"理科",value:31,unit:"个"}],
             ]
          },
          {name:"广东",value:[{name:"文科",value:63},{name:"理科",value:60}]},
          {name:"广西",value:[{name:"文科",value:29},{name:"理科",value:30}]},
          {name:"海南",value:[{name:"文科",value:8},{name:"理科",value:6}]},
        ],
        fontColor:['#11ee7d','#f48225','#f4e925','#25f4f2']
      };
    },

    mounted() {
      this.getData()
      let _this = this
      window.addEventListener('resize', function () {
        if (_this.resizeTimer) clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(function () {
          _this.myChart.resize();
        }, 100)
      })
    },
    methods: {
      getData(){
        let year = new Date().getFullYear()
        this.api.adminMap({year:year}).then(res=>{
          if(res.code === 0){
            this.toolTipData = res.data
            this.dataList = []
            this.toolTipData.forEach((item,index)=>{
              if(item.name.indexOf('黑龙江') === -1 && item.name.indexOf('内蒙古') === -1){
                this.dataList.push({name:item.name.slice(0,2),value:100})
              }else {
                this.dataList.push({name:item.name.slice(0,3),value:100})
              }
            })
            this.init()
          }
        })
      },
      init(){
        this.myChart = this.$echarts.init(document.getElementById('map'))
        /*获取地图数据*/
        this.myChart.showLoading();
        // console.log(this.mapName)

        var mapFeatures = this.$echarts.getMap(this.mapName).geoJson.features;
        this.myChart.hideLoading();
        mapFeatures.forEach(v =>{
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          this.geoCoordMap[name] = v.properties.cp;

        });

        var convertData = (data) => {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = this.geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
              });
            }
          }
          return res;
        };
        let option = {
          tooltip: {
            padding: 0,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
              color: '#000',
              decoration: 'none',
            },
            // position: function (point, params, dom, rect, size) {
            //   return [point[0], point[1]];
            // },
            formatter: params=> {
              // console.log(params)
              var tipHtml = '';
              let currentData= this.toolTipData.find(item=>{
                return item.name.indexOf(params.name) > -1
              })
              if(!currentData){
                return
              }
              // console.log(currentData)
              let showData = currentData.value
              let dataHtml = ''
              showData.forEach((item,index)=>{
                let itemHtml=''
                item.forEach(i=>{
                  itemHtml+=i.name+'：'+'<span style="color:'+this.fontColor[index]+';margin:0 6px;">'+i.value+'</span>'+i.unit+' '
                })
                dataHtml+='<p style="color:#fff;font-size:12px;">'+'<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px">'+'</i>'
                  +itemHtml+'</p>'
              })
              tipHtml = '<div style="width:280px;height:180px;background:rgba(22,80,158,0.8);border:1px solid rgba(7,166,255,0.7)">'
                +'<div style="width:100%;height:40px;line-height:40px;border-bottom:2px solid rgba(7,166,255,0.7);padding:0 20px;box-sizing: border-box">'+'<i style="display:inline-block;width:8px;height:8px;background:#16d6ff;border-radius:40px;">'+'</i>'
                +'<span style="margin-left:10px;color:#fff;font-size:16px;">'+currentData.name+'</span>'+'</div>'
                +'<div style="padding:20px">'
                +dataHtml
                +'</div>'+'</div>';
              // setTimeout(function() {
              //   tooltipCharts(params.name);
              // }, 10);
              return tipHtml;
            }

          },

          visualMap: {
            show: false,
            min: 0,
            max: 200,
            left: '10%',
            top: 'bottom',
            calculable: true,
            seriesIndex: [1],
            inRange: {
              color: ['#04387b', '#467bc0'] // 蓝绿
            }
          },
          geo: {
            show: true,
            map: this.mapName,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: '#023677',
                borderColor: '#1180c7',
              },
              emphasis: {
                areaColor: '#4499d0',
              }
            },
            zoom: 1.23,   //放大地图

          },
          series: [{
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(this.dataList),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },

            itemStyle: {
              normal: {
                color: '#fff'
              }
            }
          },
            {
              type: 'map',
              map: this.mapName,
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077',
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              },
              animation: false,
              data: this.dataList
            },
            {
              name: '点',
              type: 'scatter',
              coordinateSystem: 'geo',
              zlevel: 6,
            },
            {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertData(this.dataList.sort(function(a, b) {
                return b.value - a.value;
              }).slice(0, 100)),
              symbolSize: function(val) {
                return val[2] / 10;
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'left',
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'yellow',
                  shadowBlur: 10,
                  shadowColor: 'yellow'
                }
              },
              zlevel: 1
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
  #map{
    width: 100%;
    height: 420px;
  }
</style>
