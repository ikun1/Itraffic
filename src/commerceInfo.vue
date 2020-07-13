<template>
      <div v-bind:id="ids" class="storeLoc" >
        <p class="boxtext boxtitle">商铺选址</p>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="商圈综合指数" name="1">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="商圈关键指数"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label=""
                        width="180">
                        <el-rate
                            v-model="value"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                        </el-rate>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="与城市平均相比">
                    </el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="商圈网点类型分布" name="2">
                <div id="storeType" style="width:750px;height:500px"></div>
            </el-collapse-item>
            <el-collapse-item title="客群特征" name="3">
                <div class="genderProportion">
                    <div class="blockTitle">
                        性别构成
                    </div>
                    <div class="proportionBox">
                        <div class="gender-proportion-allpic" id="allpic">
						<img class="gender-proportion-img" src="./img/pic002.png">
						<img class="gender-proportion-img" src="./img/pic002.png">
						<img class="gender-proportion-img" src="./img/pic002.png">
						<img class="gender-proportion-img" src="./img/pic002.png">
						<img class="gender-proportion-img" src="./img/pic002.png">
						<img class="gender-proportion-img" src="./img/pic001.png">
						<img class="gender-proportion-img" src="./img/pic001.png">
						<img class="gender-proportion-img" src="./img/pic001.png">
						<img class="gender-proportion-img" src="./img/pic001.png">
						<img class="gender-proportion-img" src="./img/pic001.png">
					</div>
                    <div class="firstBlockContent">
						<div class="femalebar" style="width: 55.3%;"></div>
						<div class="malebar" style="width: 44.7%;"></div>
					</div>
                    <div class="firstBlockPercent">
					<p class="female-percent">女
						<span style="font-size:1.6rem;">
							<strong class="femaleper" style="font-weight:normal;">55.3</strong>%
						</span>
					</p>
					<p class="male-percent">男
						<span style="font-size:1.6rem;">
							<strong class="maleper" style="font-weight:normal;">44.7</strong>%
						</span>
					</p>
				</div>
                    </div>
                </div>
                <div class="ageDistribution">
                    <div class="ageTitle">
                        年龄分布
                    </div>
                    <div class="ageBar" id="ageBar" style="width:400px; height:200px"></div>
                </div>
                <div class="wageGraph">
                    <div class="wageTitle">
                        商圈个人月收入占比（千月/月）
                    </div>
                    <div class="wageLine" id="wageLine" style="width:400px; height:200px"></div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="可控 Controllability" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
      </div>
</template>

<script>
import echarts from 'echarts';
export default {
    mounted(){
    },
    data(){
        return {
           activeNames: ['1'],
           tableData:  [{
            date: '2016-05-02',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '2016-05-04',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '2016-05-01',
            value: 3.7,
            address: '高于40%'
          }, {
            date: '2016-05-03',
            value: 3.7,
            address: '高于40%'
          }],
          value: 5
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
      drawStoreType() {
        //var echarts = require('echarts');
        var option = {
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
                    radius: [0, '30%'],

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
                    radius: ['40%', '55%'],
                    label: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
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
        };
        // 基于准备好的dom，初始化echarts实例
        console.log(document.getElementById('storeType'))
        var myChart = echarts.init(document.getElementById('storeType'), 'dark');
        myChart.setOption(option);
    },
      drawAgeBar() {
          var option = {
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
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [1.3, 23.1, 29.3, 26.4, 11.5, 8.4]
                }
            ]
        };
        var myChart = echarts.init(document.getElementById('ageBar'), 'light');
        myChart.setOption(option);
      },
      drawLine() {
          var option = {
            xAxis: {
                type: 'category',
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
        var myChart = echarts.init(document.getElementById('wageLine'), 'light');
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