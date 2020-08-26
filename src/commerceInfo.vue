<template>
      <div v-bind:id="ids" class="storeLoc" >
        <el-table
            v-loading="loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="tableData"
            :header-cell-style="{background:'rgb(41, 43, 61)',color:'white'}"
            style="background-color:transparent;color:black;"
            width="tableWidth">
            <el-table-column
                prop="date"
                label="商圈关键指数">
            </el-table-column>
            <el-table-column
                prop="value"
                label="">
                <el-rate
                    v-model="value"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                </el-rate>
            </el-table-column>
        </el-table>
      </div>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
        d3.select(".el-table")
            .style("background-color", " rgb(41, 43, 61)")
            .style("color", "white")
        d3.select(".el-table th")
        .style("background-color", " rgb(41, 43, 61)")
    },
    data(){
        return {
           activeNames: ['1'],
           tableData:  [{
            date: '商圈成熟度',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '人口聚集度',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '周边竞争力',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '客群消费力',
            value: 3.7,
            address: '高于40%'
          }],
          value: 5,
          loading: false,
        }
    },
    computed: {
        tableWidth: function(){
            var pieWidth = getComputedStyle(document.getElementsByClassName("storeLoc")[0],false).width;
            return pieWidth;
        }
    },
    methods: {
      handleChange(val) {
          if(val.includes("2")){
              this.drawStoreType();
          }
          if(val.includes("3")){
              this.drawAgeBar();
              this.drawLine();
          }
        console.log(val);
      },
      drawAgeBar() {
          var option = {
            title:{
                text:"各年龄人群人数",
                left: "center"
            },
            color: ['#3398DB'],
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
                    data: ['19岁以下', '19-25岁', '26-30岁', '31-35岁', '36-40岁', '40岁以上'],
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
                    name: '人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: [1.3, 23.1, 29.3, 26.4, 11.5, 8.4]
                }
            ]
        };
        var myChart = echarts.init(document.getElementById('ageBar'), 'dark');
        myChart.setOption(option);
      },
      drawLine() {
          var option = {
            title:{
                text: "各收入人群人数",
                left: "center"
            },
            xAxis: {
                type: 'category',
                axisTick: {
                    interval: 0
                },
                data: ['0-3000元', '3000-5000元', '5000-8000元', '8000-15000元', '15000元以上']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [12.1, 14.9, 23.4, 28.5, 20.3],
                type: 'line'
            }]
        };
        var myChart = echarts.init(document.getElementById('wageLine'), 'dark');
        myChart.setOption(option);

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