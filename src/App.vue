<template>
  <div class="outmap outside">
    <div class="inside">
      <div id="container" class="mymap inmap" v-bind:class="{ mapranging: isMapranging}"></div>
      <img id="toolButton" class="floatToolBar toolButton" v-bind:class="{ hide:!status.heatmap }" v-bind:style="{left:countLeft(0)}" src="./img/heatmaptool.png" v-show="unfold" v-on:click="unfoldBox('toolBox')" />
      <img id="toolButton2" class="floatToolBar toolButton"  v-bind:class="{ hide:!status.path }" v-bind:style="{left:countLeft(1)}" src="./img/pathtool.png" v-show="unfold" v-on:click="initPath"/>
      <img id="arrestButton" class="floatToolBar toolButton" v-bind:class="{ hide:!status.arrest }" v-bind:style="{left:countLeft(2)}" src="./img/arresttool.png" v-show="unfold" v-on:click="unfoldBox('arrestDialog')"/>
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
      <arrestDialog  v-show="!unfold" id="arrestDialog" ref="arrestDialog"  @range="reactRange" v-bind:left="leftOfArrest"/>
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
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle">范围分析</p>
            <img id="rangeButton" class="boxtext boxsubtitle" src="./img/range.png" v-on:click="reactRange('heatmap')" />
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
import arrestDialog from './arrestDialog.vue';
import { pathColor } from './util.js';
import { drawTable } from './tripTable.js';

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
    geocoder:'', 
    address:'',
    passedPolyline:'',//已移动过的路径
    infoWindow:'',//信息悬浮框
    marker:'',//绘制轨迹的logo
    lineArr:'',//移动路径
    pathData:'',
    heatmapdata:'',//热力图基础数据
    nowdataindex:0,
    unfold:true,//是否折叠热力工具窗
    datasee:false,//是否显示数据分析窗
    isMapranging:false,//是否处于范围选取状态
    reactRangeType:'',//范围响应状态
    ammount:0,//个体数量
    arrestData:'',//驻点基础数据
    arrestCircles:[],//驻点显示圆圈合集
    leftOfArrest:'-20%',
    scale:'',//颜色比例尺
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
    dataInfo,
    arrestDialog
  },
  methods: {
    loadmap(){
      this.map = new AMap.Map('container', {
        zoom: 12,
        mapStyle: 'amap://styles/whitesmoke',
        features: ['bg', 'road', 'building', 'point'],
        center: [123.438261, 41.821984]
      });
      var map = this.map;

      //判断浏览区是否支持canvas
      function isSupportCanvas() {
          var elem = document.createElement('canvas');
          return !!(elem.getContext && elem.getContext('2d'));
      }

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
      dataGenerator.mergeData(cache,1);
      });

      AMap.plugin('AMap.Geocoder', function() {
        cache.geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
      });
    })

    },
    countLeft(index){
      var left = 15;
      if(index > 0){
        if(this.status.heatmap){
          left = left + 40;
        }
      }
      if(index > 1){
        if(this.status.path){
          left = left + 40;
        }
      }
      return left + "px";
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
    initArrestData(arrestData,min,max){
      this.arrestData = arrestData;
      this.scale = d3.scaleLinear().domain([min,max]).range([1,129])
      this.initColor(this.scale,min,max);
      this.loadArrestData(arrestData);
    },
    loadArrestData(arrestData){
      this.arrestCircles.forEach(function(circle){
        this.map.remove(circle);
      },this);
      arrestData.forEach(function(user){
        user.arrests.forEach(function(arrest){
          var scale = this.scale;
          var circle = new AMap.Circle({
            center: arrest.location,  // 圆心位置
            radius: 100, // 圆半径
            fillColor: 'rgba(1, 88, ' + scale(arrest.hours) + ', 0.6)',   // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
          });
          this.arrestCircles.push(circle);
          this.map.add(circle);
          if(!this.status.arrest){
          circle.hide();
          }
        },this)
      },this);
    },
    initColor(scale,min,max){
      //计算驻点图例
      var target = this.$refs.arrestDialog;
      target.minicolor='rgba(1, 88, ' + scale(min) + ', 1)';
      target.midiumcolor='rgba(1, 88, ' + scale((min+max)/2) + ', 1)';
      target.maxcolor='rgba(1, 88, ' + scale(max) + ', 1)';
      //将数据集排序，取出最大值,生成图例
      target.mininumber = min;
      target.midiumnumber = Math.round((min+max)/2);
      target.maxnumber =  max;
    },
    unfoldBox(boxType){
      //展开盒子
      this.unfold = false;
      d3.select("#"+boxType).transition().style("left", "0%");
    },
    foldBox(){
      if(!this.unfold){
        this.foldTargetBox("#toolBox");
        this.foldTargetBox("#arrestDialog");
      }
    },
    foldTargetBox(target){
      var cache = this;
      var toolBox = d3.select(target);
      var left = toolBox.style("left");
      if(left == "0%"){
      toolBox.transition().style("left", "-20%").on('end', function(){
        cache.unfold = true;
      });
      }
    },
    reactRange(type){
      //圈选范围响应
      this.unfold = true;
      this.isMapranging=true;
      this.reactRangeType = type;
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
          this.countInfo(this.reactRangeType);
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
    countInfo(type){
      //计算圈选范围详细信息
      var center = this.rangestate.circle.getCenter();
      var radius = this.rangestate.circle.getRadius();
      var count = 0;
      var typeinfo = JSON.parse(JSON.stringify(dataGenerator.attrs));//克隆一份对象，不影响原值
      if(type == "heatmap"){
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
      }else if(type == "arrest"){
        var newData = [];
          this.arrestData.forEach(user=>{  
          //遍历所有点，找出在圆范围的点
          var newArrest = [];
          for(var i = 0;i<user.arrests.length;i++){
            var a = user.arrests[i];
            if(dataGenerator.isInCircle(a.location,center,radius)){
              newArrest.push(a);
            }
            count++;
          }
          if(newArrest.length > 0){
          typeinfo[user.attr].info.push({
            id:user.id,
            arrests:newArrest,
            attr:user.attr
          });
          newData.push({
            id:user.id,
            arrests:newArrest,
            attr:user.attr
          });
          }
        },this);
        console.log(newData);
        this.loadArrestData(newData);
      }
      this.ammount = count;
      this.$refs.dataInfoBox.countInfo(type,typeinfo);
      d3.select("#infoBox").transition().style("left", "80%");
    },
    drawData(heatmapdata){
    this.heatmap.setDataSet({
        data: heatmapdata
    });
    },
    initPath(){
    var jsonPath = this.pathData;
    console.log(jsonPath)
    for (var userId in jsonPath) {
        var selectedPeople = jsonPath[userId];
        
        if (typeof (selectedPeople) == "undefined") continue;
        for(var pathSeg in selectedPeople){
          this.createPath(selectedPeople[pathSeg])
        }
    }
    drawTable();
    },
    initMarker(){
    this.passedPolyline = new AMap.Polyline({
        map: this.map,
        // path: lineArr,
        position: [116.478935, 39.997761],
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
    });
    this.marker = new AMap.Marker({
        map: this.map,
        position: [123.4119873,41.8078804],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
    });
    this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        offset: {x: 0, y: -30}
    });
    //console.log(this.createContent())
    this.createInfroWin();
		var self = this;
    this.marker.on('moving', function (e) {
      self.passedPolyline.setPath(e.passedPath);
    });
    },
    createPath(data){
      var path = []
      for (var i = 0; i < data['path'].length; i++) {
            // if (getFirst) {
            //     this.lineArr = path;
            //     getFirst = false;
            // }
            path.push(new AMap.LngLat(data['path'][i][0], data['path'][i][1]))
        }
        // 创建折线实例
        var polyline = new AMap.Polyline({
            map: this.map,
            path: path,
            showDir: true,
            strokeColor: pathColor(data['mode']),  //线颜色"#28F"
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
        });
        
    },
    createInfroWin(){
        var cache = this;
        var address;
        this.geocoder.getAddress([123.4119873,41.8078804], function(status, result) {
            if (status === 'complete'&&result.regeocode) {
              console.log(result.regeocode.formattedAddress)
                address = result.regeocode.formattedAddress;
                var s = []; 
                s.push("<b>名称：" + "460020095006349317"+"</b>");
                s.push("地址：" + address);
                s.push("状态：" + "state");
                var rel =  s.join("<br>");
                //console.log(cache.infoWindow)
                cache.infoWindow.setContent(rel)
                cache.infoWindow.open(cache.map, cache.marker.getPosition());
            }else{
                log.error('根据经纬度查询地址失败')
            }
        })
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