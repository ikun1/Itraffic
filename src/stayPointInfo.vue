<template>
<div v-bind:id="ids" class="genderProportion">
    <div class="pointInfo">
        <div class="staypointtext">
            所选驻点:<p class="text chinese " id="point">{{arrestData.address}}</p>
            驻点频率:<p class="text chinese " id="frequency">{{arrestData.frequency}}</p>
            驻留时间:<p class="text chinese" id="time">{{arrestData.lastTime}}h</p>
        </div>
    </div>
    <div class="bussinessInfo"></div>
</div>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
        var width = getComputedStyle(document.getElementsByClassName("bussinessInfo")[0],false).width;
        var height = getComputedStyle(document.getElementsByClassName("bussinessInfo")[0],false).height;
        //var heightDistrict = getComputedStyle(document.getElementsByClassName("districtLine")[0],false).height;
          var pieHeight = "200px";
        d3.select(".bussinessInfo")
            .style("width", width)
            .style("height", height);
        this.drawBussinessBar();
    },
    data(){
        return {
            arrestData:{
                "lastTime": 0.47,
                "frequency": 3,
                "address": "辽宁省沈阳市和平区抚顺路",
            }
        }
    },
    computed: {
    },
    methods: {
      drawBussinessBar(){
          d3.json("./src/data/point.json").then(function (points) {
                let maxfrequecy = 0;
                let maxtime = 0;
                let staypoint = points.features;
                let businessArray = []
                var businessTop = []
                let businessMap = new Map();
                //处理得到商圈的信息
                for(let key in staypoint){
                    
                    // console.log(staypoint[key])
                    // console.log(staypoint[key]["properties"])
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
                console.log("businessTop")
                console.log(businessTop.map(d => d.value))
                
                var option = {
                    color: ['#3398DB'],
                    title: {
                        text: "商圈热度分析",
                        left: "center"
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
                            data: businessTop.map(d => d.name),
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel:{
                                interval:0,
                                rotate:45,
                                margin:2
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
                            name: '商圈流量',
                            type: 'bar',
                            barWidth: '60%',
                            data: businessTop.map(d => d.value)
                        }
                    ]
                };
                var businessChart = echarts.init(document.getElementsByClassName('bussinessInfo')[0], 'dark');
                businessChart.setOption(option);
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
.staypointtext{
    font-weight: bold;
    color: white;
}
</style>