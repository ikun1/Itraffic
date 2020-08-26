<template>
  <div v-bind:id="ids" class="genderProportion">
    <div class="blockTitle">性别构成</div>
    <div class="proportionBox">
      <div class="gender-proportion-allpic" id="allpic">
        <img class="gender-proportion-img" src="./img/pic002.png" />
        <img class="gender-proportion-img" src="./img/pic002.png" />
        <img class="gender-proportion-img" src="./img/pic002.png" />
        <img class="gender-proportion-img" src="./img/pic001.png" />
        <img class="gender-proportion-img" src="./img/pic001.png" />
        <img class="gender-proportion-img" src="./img/pic001.png" />
      </div>
      <div class="firstBlockContent">
        <div class="femalebar" style="width: 55.3%;"></div>
        <div class="malebar" style="width: 44.7%;"></div>
      </div>
      <div class="firstBlockPercent">
        <p class="female-percent">
          女
          <span style="font-size:1.6rem;">
            <strong class="femaleper" style="font-weight:normal;">55.3</strong>%
          </span>
        </p>
        <p class="male-percent">
          男
          <span style="font-size:1.6rem;">
            <strong class="maleper" style="font-weight:normal;">44.7</strong>%
          </span>
        </p>
      </div>
    </div>
    <div class="ageDistribution">
      <div class="ageBar" id="ageBar"></div>
    </div>
    <div class="wageGraph">
      <div class="wageLine" id="wageLine"></div>
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
  </div>-->
</template>

<script>
import echarts from "echarts";
import * as d3 from "d3";
require('echarts-wordcloud');
export default {
  mounted() {
    var width = getComputedStyle(
      document.getElementsByClassName("storeLoc")[0],
      false
    ).width;
    var pieHeight = "200px";
    d3.select(".ageBar").style("width", width).style("height", pieHeight);
    d3.select(".wageLine").style("width", width).style("height", pieHeight);
    this.drawAgeBar();
    this.drawLine();
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    drawAgeBar() {
      var option = {
        title: {
          text: "年龄分布",
          left: "center",
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "19岁以下",
              "19-25岁",
              "26-30岁",
              "31-35岁",
              "36-40岁",
              "40岁以上",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [1.3, 23.1, 29.3, 26.4, 11.5, 8.4],
          },
        ],
      };
      var myChart = echarts.init(document.getElementById("ageBar"), "dark");
      myChart.setOption(option);
    },
    drawLine() {
      var option = {
        title: {
          text: "关键词词云", //标题
          x: "center",
          textStyle: {
            fontSize: 23,
          },
        },
        backgroundColor: rgb(41,41,41),
        tooltip: {
          show: true,
        },
        series: [
          {
            name: "热点分析", //数据提示窗标题
            type: "wordCloud",
            drawOutOfBound: false,
            sizeRange: [6, 66], //画布范围
            rotationRange: [-45, 90], //数据翻转范围
            shape: "circle",
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6,
            },
            textStyle: {
              normal: {
                color: function () {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            
            data: [
                {name:'美食',value:200},
			{name:'人多',value:200},
			{name:'吃喝',value:150},
			{name:'逛街',value:150},
			{name:'打卡',value:180},
			{name:'周末',value:160},
			{name:'太原街',value:170},
			{name:'环境好',value:100},
			{name:'晚餐',value:210},
			{name:'停车',value:190},
			{name:'夏天',value:190},
			{name:'一号线',value:190},
			{name:'单位',value:180},
			{name:'地铁',value:170},
			{name:'不错',value:180},
			{name:'约会',value:175},
			{name:'位置优越',value:155},
			{name:'公交多',value:210},
			{name:'拍照',value:195},
			{name:'好玩',value:500},
			{name:'电梯',value:229},
			{name:'排队',value:60},
			{name:'回头客',value:320},
			{name:'安静',value:167},
			{name:'一般',value:99},
        ], //数据
          },
        ],
      };
      var myChart = echarts.init(document.getElementById("wageLine"), "dark");
      myChart.setOption(option);
    },
  },
  props: {
    ids: {
      type: String,
    },
  },
};
</script>

<style>
</style>