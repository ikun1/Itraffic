<template>
  <div class="outmap outside">
    <div class="inside">
      <div id="container" class="mymap inmap" v-bind:class="{ mapranging: isMapranging}"></div>
      <img id="toolButton" class="floatToolBar" src="./img/tools.png" v-show="unfold" v-on:click="unfoldBox" />
      <img id="toolButton2" class="floatToolBar" src="./img/tools.png" v-on:click="initPath"/>
      <div id="toolBox" style="left:-20%;" class="floatToolBar" v-show="!unfold">
        <p class="boxtext boxtitle">热力图设置</p>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">日期:</p>
            <p class="boxtext boxsubtitle" style="width:200px">2020/2/17</p>
          </div>
          <div class="fillbox">
            <input type="range" value="50" min="0" max="100" step="1" class="slider" />
          </div>
        </div>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">小时:</p>
            <p class="boxtext boxsubtitle" style="width:200px">09:00</p>
          </div>
          <div class="fillbox">
            <input type="range" value="50" min="0" max="100" step="1" class="slider" />
          </div>
        </div>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">出行范围:</p>
            <p class="boxtext boxsubtitle" style="width:200px">0.000公里</p>
          </div>
          <div class="fillbox">
            <input type="range" value="50" min="0" max="100" step="1" class="slider" />
          </div>
        </div>
        <div class="boxitem">
          <p class="boxtext boxsubtitle">图例:</p>
          <svg width="100%" height="30px" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <line x1="5%" y1="10" x2="35%" y2="10" v-bind:style="{ stroke: minicolor }" class="colorline" />
            <line x1="35%" y1="10" x2="65%" y2="10" v-bind:style="{ stroke: midiumcolor }" class="colorline" />
            <line x1="65%" y1="10" x2="95%" y2="10" v-bind:style="{ stroke: maxcolor }" class="colorline" />
            <text x="20%" y="30" v-bind:fill="minicolor" class="colortext">{{mininumber}}</text>
            <text x="50%" y="30" v-bind:fill="midiumcolor" class="colortext">{{midiumnumber}}</text>
            <text x="80%" y="30" v-bind:fill="maxcolor" class="colortext">{{maxnumber}}</text>
          </svg>
        </div>
        <div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle">范围分析</p>
            <img id="rangeButton" class="boxtext boxsubtitle" src="./img/range.png" v-on:click="reactRange" />
          </div>
        </div>
      </div>
      <div id="infoBox" style="left:100%;" class="floatToolBar" >
        <p class="boxtext boxtitle">范围分析</p>
        <div style="width:100%">
          <p class="boxtext boxsubtitle">选定面积:</p>
          <p class="boxtext boxsubtitle" style="width:200px">{{rangestate.rangeArea}}km²</p>
        </div>
        <div style="width:100%">
          <p class="boxtext boxsubtitle">个体数量:</p>
          <p class="boxtext boxsubtitle" style="width:200px">{{ammount}}</p>
        </div>
        <dataInfo ref="dataInfoBox" @func="drawData"/>
      </div>
    </div>
  </div>
</template>
<script>

import AMap from 'AMap';   //在页面中引入高德地图
import * as d3 from 'd3';//引入d3
import { dataGenerator } from './dataGenerator.js'
import dataInfo from './dataInfo.vue';

export default {
  mounted(){
    console.log("mounted")
      this.loadmap();     //加载地图和相关组件
    this.$api.path.getPathJson({}).then(res => {
      this.pathData = res.data;
 });
  },
  data () {
  return {
    map:'',
    heatmap:'',
    pathData:'',
    heatmapdata:'',
    minicolor:'blue',//图例三种颜色
    midiumcolor:'rgb(0, 255, 0)',
    maxcolor:'red',
    mininumber:'0',//图例三种数字
    midiumnumber:'0',
    maxnumber:'0',
    unfold:true,//是否折叠热力工具窗
    datasee:false,//是否显示数据分析窗
    isMapranging:false,//是否处于范围选取状态
    ammount:0,//个体数量
    rangestate:{//选取圆形范围
      begin:'',
      end:'',
      circle:'',
      rangeArea:0,//选定圆形面积,单位平方公里
      generateCircle(){
        var begin = this.begin;
        var end = this.begin;
        var center = new AMap.LngLat((begin.getLng()+end.getLng())/2,(begin.getLat()+end.getLat())/2);
        this.circle = new AMap.Circle({
          center: center,  // 圆心位置
          radius: AMap.GeometryUtil.distance(begin, end)/2, // 圆半径
          fillColor: 'rgba(5, 160, 88, 0.2)',   // 圆形填充颜色
          strokeColor: '#fff', // 描边颜色
          strokeWeight: 2, // 描边宽度
        });
      },
      refreshCircle(){
        //刷新圆显示
        var begin = this.begin;
        var end = this.end;
        var center = new AMap.LngLat((begin.getLng()+end.getLng())/2,(begin.getLat()+end.getLat())/2);
        this.circle.setCenter(center);
        this.circle.setRadius(AMap.GeometryUtil.distance(begin, end)/2);
        this.countArea();
      },
      countArea(){
        //计算圆圈面积
        var r = AMap.GeometryUtil.distance(this.begin, this.end)/2;
        var area = 3.14 * Math.pow(r,2);
        this.rangeArea = Math.round(area/1e6);
      }
    }

  }
},
  components:{
    dataInfo
  },
  methods: {
    loadmap(){
      this.map = new AMap.Map('container', {
        zoom: 12,
        mapStyle: 'amap://styles/whitesmoke',
        center: [116.418261, 39.921984]
      });
      var map = this.map;

      //判断浏览区是否支持canvas
      function isSupportCanvas() {
          var elem = document.createElement('canvas');
          return !!(elem.getContext && elem.getContext('2d'));
      }

      this.map.setFeatures(['bg','point','building']);

      this.map.on('click',function(){
        this.foldBox();
      },this);
      var cache = this;
      AMap.plugin(["AMap.Heatmap"], function () {
      //初始化heatmap对象
      cache.heatmap = new AMap.Heatmap(map, {
          radius: 25, //给定半径
          opacity: [0, 0.8],
          gradient:{
              0.5: 'blue',
              0.65: 'rgb(117,211,248)',
              0.7: 'rgb(0, 255, 0)',
              0.9: '#ffea00',
              1.0: 'red'
          }
          
      });
      dataGenerator.formatter(cache);
      });
    },
    loadHeatMap(heatmapdata){
      this.heatmapdata = heatmapdata;
      var heatmap = this.heatmap;
      var cache = this;
      heatmap.setDataSet({
          data: heatmapdata
      });
      this.heatmap = heatmap;
      this.initColor();
      console.log(heatmapdata);
    },
    initColor(){
      //计算热力图图例
      var dataset = this.heatmap.getDataSet().data;
      var gradient = this.heatmap.options.gradient;
      this.minicolor=gradient[0.5];
      this.midiumcolor=gradient[0.7];
      this.maxcolor=gradient[1.0];
      //将数据集排序，取出最大值,生成图例
      dataset.sort(function(a,b){
        return a.count-b.count;
      });
      var max = dataset[dataset.length - 1].count;
      this.mininumber = Math.round(max * 0.5);
      this.midiumnumber = Math.round(max * 0.7);
      this.maxnumber =  Math.round(max * 1.0);

    },
    unfoldBox(){
      //展开盒子
      this.unfold = false;
      d3.select("#toolBox").transition().style("left", "0%");
    },
    foldBox(){
      if(!this.unfold){
        var target = this;
      d3.select("#toolBox").transition().style("left", "-20%").on('end', function(){
        target.unfold = true;
      });
      }
    },
    reactRange(){
      //圈选范围响应
      this.unfold = true;
      this.isMapranging=true;
      var rangestate = this.rangestate;
      var map = this.map;
      var isTouching = false;
      var downEvent = function(ev){
        if(!isTouching){
          //非选取状态按下，进入选取状态
        map.remove(rangestate.circle);
        rangestate.begin = ev.lnglat;
        rangestate.end = ev.lnglat;
        rangestate.generateCircle();
        map.add(rangestate.circle);
        }else{
          //选取状态下再点击，完成圈选
          map.off('mousedown',downEvent);
          map.off('mousemove',moveEvent);
          this.map.panTo(this.rangestate.circle.center);
          this.isMapranging = false;
          this.countInfo();
        }
        isTouching = !isTouching;
      }
      var moveEvent = function(ev){
        if(isTouching){
          rangestate.end = ev.lnglat;
          rangestate.refreshCircle();
        }
      }
      this.map.on('mousedown',downEvent,this);
      this.map.on('mousemove',moveEvent,this);
    },
    countInfo(){
      //计算圈选范围详细信息
      var center = this.rangestate.circle.getCenter();
      var radius = this.rangestate.circle.getRadius();
      var count = 0;
      var typeinfo = JSON.parse(JSON.stringify(dataGenerator.attrs));//克隆一份对象，不影响原值
      this.heatmapdata.forEach(v=>{  
        //遍历所有点，找出在圆范围的点
        var point = new AMap.LngLat(v.lng,v.lat);
        if(dataGenerator.isInCircle(point,center,radius)){
          v.info.forEach(h=>{
            typeinfo[h.attr].info.push({
              id:h.id,
              location:point
            });
            count++;
          },this);
        }
      },this);
      this.ammount = count;
      this.$refs.dataInfoBox.countInfo(typeinfo);
      d3.select("#infoBox").transition().style("left", "80%");
    },
    drawData(heatmapdata){
    this.heatmap.setDataSet({
        data: heatmapdata
    });
    },
    initPath(){
      var jsonPath = this.pathData;
      for(var userId in jsonPath){
        var path = []
        var selectedPeople = jsonPath[userId];
        if(typeof(selectedPeople) == "undefined" ) continue;
        for(var i=0; i<selectedPeople.length; i++){
          path.push(new AMap.LngLat(selectedPeople[i][0][0],selectedPeople[i][0][1]))
        }
        // 创建折线实例
var polyline = new AMap.Polyline({
    path: path,  
    borderWeight: 2, // 线条宽度，默认为 1
    strokeColor: 'red', // 线条颜色
    lineJoin: 'round' // 折线拐点连接处样式
});
// 将折线添加至地图实例
this.map.add(polyline);
      }

    }
  }
}



</script>
<style scoped>
    

</style>