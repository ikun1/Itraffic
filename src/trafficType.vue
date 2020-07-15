<template>
<div v-bind:id="ids" class="genderProportion">
    <div class="trafficTypePie"></div>
    <div class="trafficTypeDonut"></div>
</div>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
        var width = getComputedStyle(document.getElementsByClassName("trafficTypePie")[0],false).width;
        var height = getComputedStyle(document.getElementsByClassName("storeLoc")[0],false).height;
          var pieHeight = "200px";
        d3.select(".trafficTypePie")
            .style("trafficTypePie", width)
            .style("trafficTypePie", height);
        d3.select(".trafficTypeDonut")
            .style("width", width)
            .style("height", height);  
        this.drawPieGraph(); 
    },
    data(){
        return {
        }
    },
    computed: {
    },
    methods: {
      drawPieGraph() {
          d3.json("./src/data/time15.json").then(function (data) {
            var piedata = [
                { name: '机动车', value: 0 },
                { name: '步行及骑行', value: 0 },
                { name: '公共交通', value: 0 }
            ];
            var donutdata = [
                { name: '公交', value: 0 },
                { name: '地铁', value: 0 },
                { name: '驾车', value: 0 },
                { name: '骑行', value: 0 },
                { name: '步行', value: 0 }
            ];
            var timedata = []
            var districtSum = []
            var districtMap = new Map();
            //初始化饼图与环形图的数据
            for (let key in data) {
                for (let district in data[key]) {
                    if (!districtMap.has(district)) {
                        districtMap[district] = 0;
                    }
                    let sum = 0;
                    for (let way in data[key][district]) {
                        if (way == '公交') {
                            piedata[2]['value'] += data[key][district][way]
                            donutdata[0]['value'] += data[key][district][way]
                            sum += data[key][district][way]
                        } else if (way == '地铁') {
                            piedata[2]['value'] += data[key][district][way]
                            donutdata[1]['value'] += data[key][district][way]
                            sum += data[key][district][way]
                        } else if (way == '驾车') {
                            piedata[0]['value'] += data[key][district][way]
                            donutdata[2]['value'] += data[key][district][way]
                            sum += data[key][district][way]
                        } else if (way == '骑行') {
                            piedata[1]['value'] += data[key][district][way]
                            donutdata[3]['value'] += data[key][district][way]
                            sum += data[key][district][way]
                        } else if (way == '步行') {
                            piedata[1]['value'] += data[key][district][way]
                            donutdata[4]['value'] += data[key][district][way]
                            sum += data[key][district][way]
                        }
                    }
                    districtMap[district] += sum;
                }
            }
            var option = {
                title: {
                    text: '交通类型分布1',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['机动车', '步行及骑行', '公共交通']
                },
                series: [
                    {
                        name: '交通类型',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        label: {
                            show:false
                        },
                        data: piedata,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var pieChart = echarts.init(document.getElementsByClassName('trafficTypePie')[0], 'dark');
            pieChart.setOption(option);

            var option2 = {
                title: {
                    text: '交通类型分布2',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['公交', '地铁', '驾车', '骑行', '步行']
                },
                series: [
                    {
                        name: '交通方式',
                        type: 'pie',
                        label: {
                            show:false
                        },
                        radius: [30, 110],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        data: donutdata
                    }
                ]
            };
            var donutChart = echarts.init(document.getElementsByClassName('trafficTypeDonut')[0], 'dark');
            donutChart.setOption(option2);
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