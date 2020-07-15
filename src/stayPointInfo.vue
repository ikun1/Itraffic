<template>
<div v-bind:id="ids" class="genderProportion">
    <div class="pointInfo"></div>
    <div class="bussinessInfo"></div>
</div>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
        var width = getComputedStyle(document.getElementsByClassName("totalLine")[0],false).width;
        var heightTotal = getComputedStyle(document.getElementsByClassName("totalLine")[0],false).height;
        var heightDistrict = getComputedStyle(document.getElementsByClassName("districtLine")[0],false).height;
          var pieHeight = "200px";
        d3.select(".totalLine")
            .style("totalLine", width)
            .style("totalLine", heightTotal);
        d3.select(".districtLine")
            .style("width", width)
            .style("height", heightDistrict);  
        this.drawPieAndLine();
        this.drawTotalBar(); 
    },
    data(){
        return {
        }
    },
    computed: {
    },
    methods: {
      drawPieAndLine() {
          d3.json("./src/data/district.json").then(function (districtdata) {
                //初始化保存每个区各个时段的对象
                let districtObj = {};
                for (let key in districtdata['1']) {
                    districtObj[key] = new Array(24);
                }
                console.log(districtObj)
                //为对象赋值
                for (var time in districtdata) {
                    let timeint = parseInt(time) - 1;
                    for (let dis in districtdata[time]) {
                        districtObj[dis][timeint] = districtdata[time][dis].length;
                    }
                }
                //因为5时段为空，所以为5赋值为0
                //每个区对应数组的第25位为总和
                let countMax = 0;
                let countMin = 0;
                for (let dis in districtObj) {
                    districtObj[dis][4] = 0;
                    let sum = districtObj[dis].reduce((a, b) => a + b);
                    if (countMax < sum) countMax = sum;
                    if (countMin > sum) countMin = sum;
                    districtObj[dis].push(sum);
                }

                // 预处理绘制所需的数据结构
                let districtArray = [];
                for (let key in districtObj) {
                    districtObj[key].pop()
                    let value = districtObj[key];
                    districtArray.push({
                        'name': key,
                        'value': value
                    })
                }
                let xArray = [];
                for (let i = 0; i < 24; i++) {
                    xArray.push(i + 1);
                }
                let echartsLinePieData = []
                let curArray = []
                curArray.push('district');
                for(var i=0; i<24; i++){
                    curArray.push(i.toString());
                }
                echartsLinePieData.push(curArray)
                for(let index in districtArray){
                    let curDisArray = []
                    curDisArray.push(districtArray[index]['name'])
                    echartsLinePieData.push(curDisArray.concat(districtArray[index]['value']))
                }
                console.log(echartsLinePieData)
                var myChart = echarts.init(document.getElementsByClassName('districtLine')[0], 'dark');
                var optionPieAndLine = {
                    title: {
                        text: "各行政区时段出行量",
                        left: 'center'
                    },
                    legend: {
                        type: 'scroll',
                        top: 20
                    },
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    dataset: {
                        source: echartsLinePieData
                    },
                    xAxis: {type: 'category'},
                    yAxis: {gridIndex: 0},
                    grid: {top: '65%'},
                    series: [
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: '30%',
                            center: ['50%', '35%'],
                            label: {
                                formatter: '{b}: {@2012} ({d}%)'
                            },
                            encode: {
                                itemName: 'product',
                                value: '2012',
                                tooltip: '2012'
                            }
                        }
                    ]
                };

                myChart.on('updateAxisPointer', function (event) {
                    var xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        var dimension = xAxisInfo.value + 1;
                        myChart.setOption({
                            series: {
                                id: 'pie',
                                label: {
                                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                                },
                                encode: {
                                    value: dimension,
                                    tooltip: dimension
                                }
                            }
                        });
                    }
                });

                myChart.setOption(optionPieAndLine);
          })
      },
      drawBussinessBar(){
          d3.json("point.json").then(function (points) {
                let maxfrequecy = 0;
                let maxtime = 0;
                let staypoint = points.features;
                let businessArray = []
                let businessTop = []
                let businessMap = new Map();
                //处理得到商圈的信息
                for(let key in staypoint){
                    
                    // console.log(staypoint[key])
                    // console.log(staypoint[key]["properties"])
                    console.log()
                    let business = staypoint[key]["properties"]["business"].split(",")
                    for(let bus of business){
                        if(bus == "") continue;
                        if(!businessMap[bus]){
                            businessMap[bus] = 1;
                        }else{
                            businessMap[bus] = businessMap[bus] + 1;
                        }
                    }
                }
                for(let key in businessMap){
                    businessArray.push({
                        name: key,
                        value: businessMap[key]
                    })
                }
                businessArray.sort((a,b)=> b.value-a.value)
                businessTop = businessArray.slice(0, 8)
                })
      }
    },
    props:{
        ids:{
            type:String
        }
    }
}


</script>

<style>
    
</style>