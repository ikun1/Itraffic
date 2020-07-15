<template>
  <div class="outmap">
    <div class="inside">
      <div id="container" class="mymap inmap" v-bind:class="{ mapranging: isMapranging}"></div>
      <func-menu @react="clickTools" style="display:absolute"/>
      <!--<img id="toolButton" class="floatToolBar toolButton" v-bind:class="{ hide:!status.heatmap }" v-bind:style="{left:countLeft(0)}" src="./img/heatmaptool.png" v-show="unfold" v-on:click="unfoldBox('toolBox')" />-->
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
      <arrestDialog  v-show="!unfold" id="arrestDialog" ref="arrestDialog" left="-20%" @redrawArrest="redrawArrest" @range="reactRange" @time="appearDialog"/>
      <pathDialog  v-show="!unfold" id="pathDialog" ref="pathDialog" left="-20%" @showdiagram="showdiagram"/>
      <additionDialog  v-show="!unfold" id="additionDialog" ref="additionDialog" left="-20%" @loadCommerce="loadCommerce" @beginMedical="beginMedical"/>
      <div id="toolBox" style="left:-20%;" class="floatToolBar" v-show="!unfold">
        <p class="boxtext boxtitle" v-on:click="drawPolyline">热力图工具</p>
        <div class="boxitem">
        <div style="width:100%">
            <p class="boxtext boxsubtitle" v-on:click="drawCircle">日期:</p>
            <p class="boxtext boxsubtitle" style="width:200px">2018/10/03</p>
          </div>
        </div>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">时间:</p>
            <p class="boxtext boxsubtitle" style="width:200px">{{nowdataindex}}</p>
          </div>
          <div class="fillbox">
            <input type="range"  v-model="nowdataindex" v-on:change="reloadHeatMap" min="1" v-bind:max="maxheatmap" step="1" class="slider" />
          </div>
        </div>
        
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">不透明度:</p>
            <p class="boxtext boxsubtitle" style="width:200px">100</p>
          </div>
          <div class="fillbox">
            <input type="range" value="50" min="0" max="100" step="1" class="slider" />
          </div>
        </div>
        <div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle">范围分析</p>
            <img id="rangeButton" class="boxtext boxsubtitle rangeButton" src="./img/range.png" v-on:click="reactRange('heatmap')" />
          </div>
        </div>
         <div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle">热力迁移</p>
            <img  v-on:click="reactHeatTime" class="boxtext boxsubtitle rangeButton retagleButton" src="./img/timelapses.png"  />
          </div>
        </div>
      </div>
      <dataInfo ref="dataInfoBox" ids="myinfoBox" @refreshArrest="loadArrestData" @func="drawData"/>
      <dataInfo  ids="infoBox" @refreshArrest="loadArrestData" @func="drawData"/>
      <medicalInfo id="medicalInfo" ref="medicalInfo"/>
      <!--<commerceInfo id="commerceInfo" ref="commerceInfo" />-->
      <commerceType id="commerceType" ref="commerceType" />
      <districtLine id="districtLine" ref="districtLine" />
      <trafficType id="trafficType" ref="trafficType" />
      <costomerFeature id="costomerFeature" ref="costomerFeature" />
      <infectionDialog id="infectionDialog" ref="infectionDialog" @confirm="confirmInfection" v-bind:show="infectionShow"/>

      <playDialog  id="arrestPlayDialog" ref="playDialog"  @close="closeArrest" @change="reactArrest" @stop="stopArrest"  @start="startArrest" max=0 v-bind:show="showPlayDialog"/>
      <playDialog id="heatPlayDialog" ref="heatplayDialog"  @close="closeArrest" @change="reactArrest" @stop="stopArrest"  @start="startHeat" max=0 v-bind:show="showHeatPlayDialog"/>
      <!-- <div class="input-card">
    <h4>轨迹回放控制</h4>
    <div class="input-item">
        <input type="button" class="btn" value="开始动画" id="start" v-on:click="startAnimation"/>
        <input type="button" class="btn" value="暂停动画" id="pause" v-on:click="pauseAnimation"/>
    </div>
    <div class="input-item">
        <input type="button" class="btn" value="继续动画" id="resume" v-on:click="resumeAnimation"/>
        <input type="button" class="btn" value="停止动画" id="stop" v-on:click="stopAnimation"/>
    </div>
</div> -->
    </div>
  </div>
</template>
<script>

import AMap from 'AMap';   //在页面中引入高德地图
import * as d3 from 'd3';//引入d3
import { dataGenerator } from './dataGenerator.js'
import dataInfo from './dataInfo.vue';
import arrestDialog from './arrestDialog.vue';
import pathDialog from './pathDialog.vue';
import playDialog from './playDialog.vue';
import medicalInfo from './medicalInfo.vue';
import commerceInfo from "./commerceInfo.vue";
import commerceType from "./commerceType.vue";
import trafficType from "./trafficType.vue";
import districtLine from "./districtLine.vue";
import costomerFeature from "./costomerFeature.vue";
import additionDialog from './additionDialog.vue';
import infectionDialog from "./infectionDialog.vue";
import funcMenu from './funcMenu.vue'
import { pathColor } from './util.js';
import { drawTable } from './tripTable.js';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';

export default {
  mounted(){
    console.log("mounted");
    //d3.select(".quick-menu").style("display", "absolute");
    this.loadmap();     //加载地图和相关组件
    this.$api.path.getPathJson({}).then(res => {
    this.pathData = res.data;
    this.initPath();//初始化路径分析移动到这里
    //this.changeStatus('path');
    });
    
  },
  data () {
  return {
    map:'',
    heatmap:'',
    nextheatmap:'',
    readyheatmapdata:'',
    geocoder:'', 
    address:'',
    passedPolyline:'',//已移动过的路径
    infoWindow:'',//信息悬浮框
    marker:'',//绘制轨迹的logo
    lineArr:'',//移动路径
    pathData:'',
    heatmapdata:'',//热力图基础数据
    nowdataindex:1,
    unfold:true,//是否折叠热力工具窗
    datasee:false,//是否显示数据分析窗
    isMapranging:false,//是否处于范围选取状态
    reactRangeType:'',//范围响应状态
    ammount:0,//个体数量
    arrestData:'',//驻点基础数据
    arrestCircles:[],//驻点显示圆圈合集
    scale:'',//颜色比例尺
    tscale:'',//人数颜色比例尺
    mypolyline:[],//路径线路集
    timelapses:[],//时间划分驻点数据集
    activeCircle:[],//时间数据中的活跃点
    timeindex:0,//读入文件记号
    frame:0,//时间帧代号
    heatframe:0,
    interval:'',//动画计时器 
    heatinterval:'',//热力计时器
    activeMap:new Map(),//圆点映射表
    test:0,
    frameNumber:8,
    frameRate:100,
    showPlayDialog:false,//是否展示playerdialog
    showHeatPlayDialog:false,
    maxheatmap:0,
    onetime:false,
    waitnextread:false,
    commerceMarkers:[],
    commerceDatas:[],
    infectionShow:false,
    mouseTool:'',
    status:{
      //分析图层集
      heatmap:false,//热力图（密度分析）
      arrest:false,//驻点分析
      path:false,//路径分析
      enhancement:false//增强功能
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
    arrestDialog,
    pathDialog,
    playDialog,
    additionDialog,
    funcMenu,
    commerceInfo,
    commerceType,
    trafficType,
    districtLine,
    costomerFeature,
    infectionDialog,
    medicalInfo
  },
  methods: {
    drawPolyline () {
      this.mouseTool.polyline({
        strokeColor: "#3366FF", 
        strokeOpacity: 1,
        strokeWeight: 6,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      })
    },
    drawCircle () {
      this.mouseTool.circle({
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        strokeStyle: 'solid',
        // 线样式还支持 'dashed'
        // strokeDasharray: [30,10],
      })
    },
    loadmap(){
      this.map = new AMap.Map('container', {
        zoom: 12,
        mapStyle: 'amap://styles/a27028e5b4fb05f9e2f4a4ce0258a532',
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
      AMap.plugin(["AMap.MouseTool"], function (){
         cache.mouseTool = new AMap.MouseTool(map);
          cache.mouseTool.on('draw', function(event) {
          // event.obj 为绘制出来的覆盖物对象
          //console.log(JSON.stringify(event.obj.getCenter()));
          console.log(JSON.stringify(event.obj.getPath()));
        })
      })
      AMap.plugin(["AMap.Heatmap"], function () {
      //初始化heatmap对象
      cache.heatmap = new AMap.Heatmap(map, {
          radius: 40, //给定半径
          opacity: [0, 0.8],
          gradient:{
              0.5: 'blue',
              0.65: 'rgb(117,211,248)',
              0.7: 'rgb(0, 255, 0)',
              0.9: '#ffea00',
              1.0: 'red'
          }
      });

      cache.nextheatmap = new AMap.Heatmap(map, {
          radius: 40, //给定半径
          opacity: [0, 0],
          gradient:{
              0.5: 'blue',
              0.65: 'rgb(117,211,248)',
              0.7: 'rgb(0, 255, 0)',
              0.9: '#ffea00',
              1.0: 'red'
          }
      });
      cache.nextheatmap.hide();
      
      //dataGenerator.formatter(cache,cache.nowdataindex);
      dataGenerator.formatter_heat(cache,1,"1");
      dataGenerator.mergeData(cache,1);
      dataGenerator.loadArrest(cache);
      });

      AMap.plugin('AMap.Geocoder', function() {
        cache.geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
      });
    })

    var polyline = new AMap.Polyline({
        path: dataGenerator.line1,  
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'red', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
    });
    map.add(polyline);

    var polyline2 = new AMap.Polyline({
        path: dataGenerator.line2,  
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'red', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
    });
    map.add(polyline2);

    var polyline3 = new AMap.Polyline({
        path: dataGenerator.line3,  
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'red', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
    });
    map.add(polyline3);

    var polyline4 = new AMap.Polyline({
        path: dataGenerator.line4,  
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'red', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
    });
    map.add(polyline4);
    dataGenerator.circle1.forEach(function(center){
      var circle = new AMap.Circle({
            center: center,  // 圆心位置
            radius: 200, // 圆半径
            fillColor: '#ffffff',   // 圆形填充颜色
            fillOpacity:0.6,//圆形填充透明度
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
          });
       this.map.add(circle);
       console.log("画一个")
    },this)
    

    d3.select(".quick-menu").style("position", "absolute");
    d3.select(".amap-logo").remove()
    
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
      if(this.status.path){
        this.mypolyline.forEach(function(po){
          po.show()
        });
      }else{
        this.mypolyline.forEach(function(po){
          po.hide()
        });
      }

    },
    clickTools(layerName){
      if(layerName == "path")
        {
          this.unfoldBox('pathDialog');
          this.showTrafficType();
        }else if(layerName == "arrest"){
          this.unfoldBox('arrestDialog');
        }else if(layerName == "heatmap"){
          this.showDistrictLine();
          this.unfoldBox('toolBox');
        }else if(layerName == "addition"){
          this.unfoldBox('additionDialog');
        }
    },
    reloadHeatMap(){
      this.onetime=true;
      dataGenerator.formatter_heat(this,this.nowdataindex,3)
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

      var color1=d3.rgb(81,122,68);
      var color2=d3.rgb(217,76,106);

      this.scale = function(arg){
      var scaler=d3.scaleLinear().domain([min,max]).range([0,1])

      var inter=d3.interpolate(color1,color2)
        return inter(scaler(arg))
        }

        this.tscale = function(arg){
      var scaler=d3.scaleLinear().domain([1,8]).range([0,1])

      var inter=d3.interpolate(color1,color2)
        return inter(scaler(arg))
        }

      //this.scale = d3.scaleLinear().domain([min,max]).range([248,81])
      this.initColor(this.scale,min,max);
      this.loadArrestData(arrestData);

        var typeinfo = JSON.parse(JSON.stringify(dataGenerator.attrs));
        var newData = [];
        var count = 0;
          this.arrestData.forEach(user=>{  
          //遍历所有点，找出在圆范围的点
          var newArrest = [];
          for(var i = 0;i<user.arrests.length;i++){
            var a = user.arrests[i];
              newArrest.push(a);
          }
          if(newArrest.length > 0){
          count++;
          typeinfo[user.attr].info.push({
            id:user.id,
            arrests:newArrest,
            attr:user.attr
          });
          }
        },this);
        this.$refs.additionDialog.typeinfo = typeinfo;
        this.$refs.infectionDialog.typeinfo =typeinfo;
        this.$refs.infectionDialog.countInfo();
      
    },
    loadArrestData(arrestData){
      var appearType = this.$refs.arrestDialog.modevalue;

      this.arrestCircles.forEach(function(circle){
        this.map.remove(circle);
      },this);
      this.arrestCircles.length=0;
      var attrs = dataGenerator.attrs;
      arrestData.forEach(function(user){
        var color = '';
        if(appearType){
          color = attrs[user.attr].color;
        }
        user.arrests.forEach(function(arrest){
          var scale = this.scale;
          if(!appearType){
          color = scale(arrest.hours)
        }
          var circle = new AMap.Circle({
            center: arrest.location,  // 圆心位置
            radius: 200, // 圆半径
            fillColor: color,   // 圆形填充颜色
            fillOpacity:0.6,//圆形填充透明度
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
      target.minicolor=scale(min);
      target.midiumcolor=((min+max)/2);
      target.maxcolor=scale(max);
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
        this.foldTargetBox("#pathDialog");
         this.foldTargetBox("#additionDialog");
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
    showdiagram(){
      d3.select("#infoBox").transition().style("left", "80%");
    },
    showCommerceInfo(){
      d3.select(".storeLoc").transition().style("left", "75%");
    },
    showcommerceType(){
      d3.select("#commerceType").transition().style("top", "60%");
    },
    showCostomerFeature(){
      d3.select("#costomerFeature").transition().style("left", "75%");
    },
    showTrafficType(){
      d3.select(".trafficTypePie").transition().style("left", "75%");
      d3.select(".trafficTypeDonut").transition().style("left", "75%");
    },
    showDistrictLine(){
      d3.select(".totalLine").transition().style("left", "70%");
      d3.select(".districtLine").transition().style("left", "70%");
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
    beginMedical(){
      d3.select("#container").classed("blurBackground",true);
      this.infectionShow = true;
    },
    confirmInfection(){
      d3.select("#container").classed("blurBackground",false);
      this.infectionShow = false;
    },
    loadCommerce(data){
      this.showCommerceInfo();
      this.showcommerceType();
      this.showCostomerFeature();
      var points = dataGenerator.commercePoint;
      var allpoints = [];
      var dataString = data.sort().toString();
      points.forEach(function(indata){
        if(indata.target.sort().toString()==dataString){
          allpoints.push(indata);
        }
      })
      this.commerceDatas = allpoints;
      this.commerceMarkers = [];
      var showInfo = function(marker){
        
      };
      allpoints.forEach(function(pointData){
        var imgurl;
        if(pointData.type == 0){
          imgurl = './src/img/commerce.png'
        }else if(pointData.type == 1){
          imgurl = './src/img/commerce-normal.png'
        }else if(pointData.type == 2){
          imgurl = './src/img/commerce-hot.png'
        }
        var marker = new AMap.Marker({
          position: pointData.point,
          offset: new AMap.Pixel(-10, -10),
          icon: imgurl, // 添加 Icon 图标 URL
          title: '落点建议',
          extData:pointData
        });
          var clickHandle = AMap.event.addListener(marker, 'click', function(e) {
            var cur =JSON.parse(JSON.stringify(e.target.getExtData()));
            this.commerceMarkers.forEach(function(marker){
              marker.setLabel({
                content:''
              })
            },this)
            e.target.setLabel({
                offset: new AMap.Pixel(0, -10),  //设置文本标注偏移量
                content: "<div><p class='stext'>"+cur.descript+"</p><p class='stext'>参数1："+cur.val1+"</p><p class='stext'>参数2："+cur.val2+"</p></div>", //设置文本标注内容
                direction: 'top' //设置文本标注方位
            });
            this.map.panTo(e.target.getPosition());
          },this);

        this.map.add(marker);
        this.commerceMarkers.push(marker);
      },this)

    },
    redrawArrest(){
      this.loadArrestData(this.arrestData);
    },
    appearDialog(){
      this.showPlayDialog = !this.showPlayDialog;
      var target = this.$refs.playDialog
      target.max=this.timelapses.count;
    },
    reactArrest(value){
      this.timeindex = value;
    },
    startArrest(frameNumber,frameRate){
      this.frameNumber = frameNumber;
      this.frameRate = frameRate;
      this.trigeringTime();
    },
    closeArrest(){
      this.activeMap.forEach(function(factor){
        factor.circle.hide();
      },this)
      if(this.status.arrest){
       this.arrestCircles.forEach(function(circle){
          circle.show();
        })
      }
      this.showPlayDialog = false;
    },
    stopArrest(){
      clearInterval(this.interval);
    },
    reactHeat(value){
      
    },
    startHeat(frameNumber,frameRate){
      this.frameNumber = frameNumber;
      this.frameRate = frameRate;
      dataGenerator.formatter_heat(this,this.nowdataindex+1,"3");

    },
    closeHeat(){
      
    },
    stopHeat(){
      
    },
    heat_readframe(){
      //热力图读入帧
      this.heatmap.setDataSet({
        data:this.nextheatmap.getDataSet().data
      })
      this.heatmapdata = this.nextheatmap.getDataSet().data;
      this.heatmap.setOptions({
        opacity:[0,0.8]
      })
      this.nextheatmap.setOptions({
         opacity:[0,0]
      })
      if(this.onetime){
        this.onetime=false;
        clearInterval(this.heatinterval);
        this.waitnextread = false;
        return;
      }
      this.nextheatmap.setDataSet({
        data: this.readyheatmapdata
      });
      dataGenerator.formatter_heat(this,this.nowdataindex+2,"2");
      this.nowdataindex++;
      this.waitnextread = false;
    },
    beginHeat(origindata){
      this.heatmap.setOptions({
                    opacity:[0,0.8]
                  })
                  this.nextheatmap.setOptions({
                     opacity:[0,0]
                  })
                  this.nextheatmap.setDataSet({
                    data: origindata
                  });
                this.nextheatmap.show();
                this.heatinterval =  setInterval(this.heat_refresh,this.frameRate)
    },
    heat_refresh(){
      if(this.waitnextread){
        return;
      }
      var nextopa = (0.8*(this.heatframe + 1))/this.frameNumber;
      this.heatmap.setOptions({
        opacity:[0,0.8 - nextopa]
      })
      this.nextheatmap.setOptions({
         opacity:[0,nextopa]
      })
      this.heatframe++;
      if(this.heatframe == this.frameNumber){
        this.heatframe = 0;
        this.waitnextread = true;
        this.heat_readframe();
      }
    },
    trigeringTime()
    //时间演示开始
    {
      //this.activeMap = new Map();
      if(this.status.arrest){
       this.arrestCircles.forEach(function(circle){
          circle.hide();
        })
      }
        this.freshArrest();
        this.frame=0;
      this.interval = setInterval(this.frameAction,this.frameRate);
    },
    freshArrest(){
      var index = this.timeindex;
      var integer = parseInt(this.timeindex/2);
      var decimal = this.timeindex - (integer*2);
      var str;
      if(decimal == 0){
        str = String(integer) + ".0"
      }else{
        str = String(integer) + ".5"
      }
      var data = this.timelapses[str];
      this.activeMap.forEach(function(factor){
        factor.count = 0;
      },this);
      data.forEach(function(points){
        var factor = this.activeMap.get(points[0]);
        var tscale = this.tscale;
        if($.isEmptyObject(factor)){
          var ncircle = new AMap.Circle({
              center: new AMap.LngLat(points[0],points[1]),  // 圆心位置
              radius: 200, // 圆半径
              fillColor: tscale(1),   // 圆形填充颜色
              fillOpacity:0.6,
              strokeColor: '#fff', // 描边颜色
              strokeWeight: 1, // 描边宽度
            });
          this.map.add(ncircle);
          ncircle.hide();
        
          var newfactor = {
            drawCount:0,
            count:1,
            circle:ncircle,
            isfadding:false,
          }
          this.activeMap.set(points[0],newfactor);
        }else{
          factor.count++;
        }
        },this)
        
      this.timeindex = index+1;
      var target = this.$refs.playDialog;
      var value = parseInt(index / this.timelapses.count * 100);
      target.progress = value;
      if(this.timeindex == this.timelapses.count){
        clearInterval(this.interval);
        target.showDetail = true;
      }
    },
    frameAction(){
       var framemax = this.frameNumber;//三帧为例
       var opacityDiviser = 0.6/framemax;
      this.activeMap.forEach(function(factor){
        

       
        var tscale = this.tscale;
        if(factor.drawCount == factor.count){
          
        }
         else if(factor.drawCount == 0 || factor.count == 0 || factor.isfadding){
           factor.isfadding=true;
            var diviser = (factor.count - factor.drawCount)/(framemax-this.frame);
            var drawCount = factor.drawCount;
            var count = factor.count;
            factor.drawCount = drawCount + diviser;
            var opacity;
            if(drawCount > count){
              opacity = 0.6-(opacityDiviser * (this.frame+1));
              
            }else{
              opacity =opacityDiviser * (this.frame+1);
            }
            if(opacity == 0){
              factor.circle.hide()
            }else{
              factor.circle.show()
            }
           
            factor.circle.setOptions({
            fillColor: tscale(drawCount),
            fillOpacity:opacity,
          });
            if(this.frame==framemax){
              factor.isfadding = false;
            }
         }else{
            var diviser = (factor.count - factor.drawCount)/(framemax-this.frame);
            var drawCount = factor.drawCount;
            var count = factor.count;
            factor.drawCount = drawCount + diviser;
            factor.circle.setOptions({
            fillColor: tscale(drawCount)
          });
         }

      },this);
      

      this.frame++;
      if(this.frame == framemax){
        this.frame = 0;
        this.freshArrest();
      }

    },
    reactHeatTime(){
      this.showHeatPlayDialog = !this.showHeatPlayDialog;
    },
    countInfo(type){
      //计算圈选范围详细信息
      if (this.rangestate.circle != ''){
      var center = this.rangestate.circle.getCenter();
      var radius = this.rangestate.circle.getRadius();

      }
      else{
        var center = [123.4119873,41.8078804];
        var radius = 50000000;
      }
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
          }
          if(newArrest.length > 0){
          count++;
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
        this.loadArrestData(newData);
      }
      this.$refs.dataInfoBox.countInfo(type,typeinfo,this.rangestate.rangeArea,count);
      d3.select("#myinfoBox").transition().style("left", "80%");
    },
    drawData(heatmapdata){
    this.heatmap.setDataSet({
        data: heatmapdata
    });
    },
    initPath(){
    var jsonPath = this.pathData;
    //将百度坐标转换为高德坐标
    for (var userId in jsonPath) {
        var selectedPeople = jsonPath[userId];
        if (typeof (selectedPeople) == "undefined") continue;
        for(var pathSeg in selectedPeople){
          for(var index in selectedPeople[pathSeg]['path']){
            var curloc = [selectedPeople[pathSeg]['path'][index][0], selectedPeople[pathSeg]['path'][index][1]]
            AMap.convertFrom(curloc, 'baidu', function(status, result) {
              if(result.info === 'ok'){
                var lnglats = result.locations;
                selectedPeople[pathSeg]['path'][index][0] = lnglats.lng;
                selectedPeople[pathSeg]['path'][index][1] = lnglats.lat;
              }
            })
          }
        }
    }
    for (var userId in jsonPath) {
        var selectedPeople = jsonPath[userId];
        
        if (typeof (selectedPeople) == "undefined") continue;
        for(var pathSeg in selectedPeople){
          //console.log(selectedPeople[pathSeg])
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
            strokeWeight: 3,      //线宽
            // strokeStyle: "solid"  //线样式
        });
        this.mypolyline.push(polyline);
        
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