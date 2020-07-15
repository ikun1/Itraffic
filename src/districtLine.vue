<template>
<div v-bind:id="ids" class="genderProportion">
    <div class="totalLine"></div>
    <div class="districtLine"></div>
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
                    curArray.push(i);
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
      drawTotalBar() {
          d3.json("./src/data/time15.json").then(function (data) {
            var timedata = []
            var echartsBarData = []
            //初始化各个时间段的交通数据
            for (let key in data) {
                let index = timedata.length;
                timedata.push({
                    name: key,
                    '公交': 0,
                    '地铁': 0,
                    '驾车': 0,
                    '骑行': 0,
                    '步行': 0,
                    sum: 0
                })
                for (let district in data[key]) {
                    for (let way in data[key][district]) {
                        timedata[index][way] += data[key][district][way]
                    }
                }
                echartsBarData.push(timedata[index]['公交'] + timedata[index]['地铁'] + timedata[index]['驾车'] + timedata[index]['骑行'] + timedata[index]['步行']);
            }
            console.log("timeData")
            console.log(echartsBarData)
            var option = {
                color: ['#3398DB'],
                title: {
                    text: '各时段出行量',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '出行量',
                        type: 'bar',
                        barWidth: '60%',
                        data: echartsBarData
                    }
                ]
            };
            var myChart = echarts.init(document.getElementsByClassName('totalLine')[0], 'dark');
            myChart.setOption(option)
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