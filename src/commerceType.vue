<template>
<div v-bind:id="ids" class="commerceType">
    <div id="storeType">
    </div>
</div>
      <!-- <div v-bind:id="ids" class="costomerFeature" >
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="商圈综合指数" name="1">
                
            </el-collapse-item>
            <el-collapse-item title="商圈网点类型分布" name="2">
                <div id="storeType"></div>
            </el-collapse-item>
            <el-collapse-item title="客群特征" name="3">
                
            </el-collapse-item>
            <el-collapse-item title="可控 Controllability" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
      </div> -->
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
        var width = getComputedStyle(document.getElementsByClassName("commerceType")[0],false).width;
        var height = getComputedStyle(document.getElementsByClassName("commerceType")[0],false).height;
        d3.select("#storeType")
            .style("width", width)
            .style("height", height);
        this.drawStoreType();
    },
    data(){
        return {
            option:{
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: ['休闲', '服务', '购物', '餐饮', '娱乐', '丽人', '旅游', '运动', '金融', '酒店', '生活', '汽车', '大型商场', '超市', '便利店', '集市', '家电数码', '家具建材', '中餐厅', '轻餐厅', '快餐厅', '外国餐厅']
            },
            series: [
                {
                    name: '商铺详情',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '40%'],
                    center: ['60%', '50%'],

                    label: {
                        position: 'inner'
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 1984, name: '休闲'},
                        {value: 2941, name: '服务'},
                        {value: 1209, name: '购物'},
                        {value: 6709, name: '餐饮'}
                    ]
                },
                {
                    name: '商铺详情',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['60%', '50%'],
                    label: {
                        show: false
                    },
                    emphasis: {
                        label:{
                            show: true
                        }
                    },
                    data: [
                        {value: 450, name: '娱乐'},
                        {value: 970, name: '丽人'},
                        {value: 327, name: '旅游'},
                        {value: 237, name: '运动'},
                        {value: 811, name: '金融'},
                        {value: 552, name: '酒店'},
                        {value: 1515, name: '生活'},
                        {value: 63, name: '汽车'},
                        {value: 81, name: '大型商场'},
                        {value: 115, name: '超市'},
                        {value: 306, name: '便利店'},
                        {value: 99, name: '集市'},
                        {value: 198, name: '家电数码'},
                        {value: 491, name: '家具建材'},
                        {value: 1492, name: '中餐厅'},
                        {value: 1719, name: '轻餐厅'},
                        {value: 2430, name: '快餐厅'},
                        {value: 895, name: '外国餐厅'}
                    ]
                }
            ]
        }
        }
    },
    computed: {
    },
    methods: {
      drawStoreType() {
        //var echarts = require('echarts');
        var option = this.option;
        // 基于准备好的dom，初始化echarts实例
        console.log(document.getElementById('storeType'))
        var myChart = echarts.init(document.getElementById('storeType'), 'dark');
        myChart.setOption(option);
    },
        
        changeData(){
            this.option.series[0].data.forEach(function(s){s.data = Math.floor(Math.random()*5000);});
            this.option.series[1].data.forEach(function(s){s.data = Math.floor(Math.random()*2000);});
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