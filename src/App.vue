<template>
  <div class="outmap outside">
    <div class="inside">
      <div id="container" class="mymap inmap" v-bind:class="{ mapranging: isMapranging}"></div>
      <img id="toolButton" class="floatToolBar" src="./img/tools.png" v-show="unfold" v-on:click="unfoldBox" />
      <img id="toolButton2" class="floatToolBar" src="./img/tools.png" v-on:click="initPath"/>
      <div id=statusOfMap class="floatStatus">
        <div class="dropdown dropdown2">
          <button class="dropbtn">图层</button>
          <div class="dropdown-content">
            <a v-bind:class="{ isShowed:status.heatmap }" v-on:click="changeStatus('heatmap')">密度分析</a>
            <a v-bind:class="{ isShowed:status.arrest }" v-on:click="changeStatus('arrest')"> 驻点分析</a>
            <a v-bind:class="{ isShowed:status.path }" v-on:click="changeStatus('path')">出行分析</a>
          </div>
        </div>
      </div>
      <div id="toolBox" style="left:-20%;" class="floatToolBar" v-show="!unfold">
        <p class="boxtext boxtitle">热力图设置</p>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">日期:</p>
            <p class="boxtext boxsubtitle" style="width:200px">2020/2/17</p>
          </div>
          <div class="fillbox">
            <input type="range"  v-model="nowdataindex" v-on:change="reloadHeatMap" min="0" max="1" step="1" class="slider" />
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
      <div class="input-card">
    <h4>轨迹回放控制</h4>
    <div class="input-item">
        <input type="button" class="btn" value="开始动画" id="start" v-on:click="startAnimation"/>
        <input type="button" class="btn" value="暂停动画" id="pause" v-on:click="pauseAnimation"/>
    </div>
    <div class="input-item">
        <input type="button" class="btn" value="继续动画" id="resume" v-on:click="resumeAnimation"/>
        <input type="button" class="btn" value="停止动画" id="stop" v-on:click="stopAnimation"/>
    </div>
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
    marker:'',//绘制轨迹的logo
    lineArr:'',//已移动过的路径
    pathData:'',
    heatmapdata:'',//热力图基础数据
    minicolor:'blue',//图例三种颜色
    midiumcolor:'rgb(0, 255, 0)',
    maxcolor:'red',
    mininumber:'0',//图例三种数字
    midiumnumber:'0',
    maxnumber:'0',
    nowdataindex:0,
    unfold:true,//是否折叠热力工具窗
    datasee:false,//是否显示数据分析窗
    isMapranging:false,//是否处于范围选取状态
    ammount:0,//个体数量
    arrestData:'',//驻点基础数据
    arrestCircles:[],//驻点显示圆圈合集
    status:{
      //分析图层集
      heatmap:true,//热力图（密度分析）
      arrest:false,//驻点分析
      path:false//路径分析
    },
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
        center: [123.438261, 41.821984]
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
      dataGenerator.formatter(cache,cache.nowdataindex);
      dataGenerator.formatter_arrest(cache,0);
      });
    },
    changeStatus(layerName){
      this.status[layerName] = !this.status[layerName];
      if(this.status.heatmap){
        this.heatmap.show();
      }else{
        this.heatmap.hide();
      }
      if(this.status.arrest){
        this.arrestCircles.forEach(function(circle){
          circle.show();
        })
      }else{
        this.arrestCircles.forEach(function(circle){
          circle.hide();
        })
      }
    },
    reloadHeatMap(){
      dataGenerator.formatter(this,this.nowdataindex);
    },
    loadHeatMap(heatmapdata){
      this.heatmapdata = heatmapdata;
      var heatmap = this.heatmap;
      var cache = this;
      heatmap.setDataSet({
          data: heatmapdata
      });
      this.heatmap = heatmap;
    },
    loadArrestData(arrestData,min,max){
      this.arrestData = arrestData;
      var scale = d3.scaleLinear().domain([min,max]).range([1,129])
      arrestData.forEach(function(user){
        user.arrests.forEach(function(arrest){
          var circle = new AMap.Circle({
            center: arrest.location,  // 圆心位置
            radius: 100, // 圆半径
            fillColor: 'rgba(1, 88, ' + scale(arrest.timestamps.length) + ', 0.6)',   // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
          });
          this.arrestCircles.push(circle);
          this.map.add(circle);
          circle.hide();
        },this)
      },this);
      this.initColor(scale,min,max);
    },
    initColor(scale,min,max){
      //计算驻点图例
      this.minicolor='rgba(1, 88, ' + scale(min) + ', 1)';
      this.midiumcolor='rgba(1, 88, ' + scale((min+max)/2) + ', 1)';
      this.maxcolor='rgba(1, 88, ' + scale(max) + ', 1)';
      //将数据集排序，取出最大值,生成图例
      this.mininumber = min;
      this.midiumnumber = Math.round((min+max)/2);
      this.maxnumber =  max;
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
    var getFirst = true;
    for (var userId in jsonPath) {
        var path = []
        var selectedPeople = jsonPath[userId];
        if (typeof (selectedPeople) == "undefined") continue;
        for (var i = 0; i < selectedPeople.length; i++) {
            if (getFirst) {
                this.lineArr = path;
                getFirst = false;
            }
            path.push(new AMap.LngLat(selectedPeople[i][0], selectedPeople[i][1]))
        }
        // 创建折线实例
        var polyline = new AMap.Polyline({
            map: this.map,
            path: path,
            showDir: true,
            strokeColor: "#28F",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
        });

    }
    this.marker = new AMap.Marker({
        map: this.map,
        position: [116.478935, 39.997761],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
    });
    this.marker.on('moving', function (e) {
        //passedPolyline.setPath(e.passedPath);
    });
    },
    startAnimation () {
        this.marker.moveAlong(this.lineArr, 200);
    },
    pauseAnimation () {
        this.marker.pauseMove();
    },
    resumeAnimation () {
        this.marker.resumeMove();
    },
    stopAnimation () {
        this.marker.stopMove();
    }
  }
}



</script>
<style scoped>
    

</style>