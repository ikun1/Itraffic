import AMap from 'AMap';   //在页面中引入高德地图
import * as d3 from 'd3';//引入d3
var dataGenerator = {
    //随机数据生成器
    originData: [],//初始数据
    attrs:[
        {
            name:'群体1',
            color:'rgb(153,50,204)',
            info:[]
        },/*
        {
            name:'群体2',
            color:'rgb(70,130,180)',
            info:[]
        },
        {
            name:'群体3',
            color:'rgb(127,255,170)',
            info:[]
        },
        {
            name:'群体4',
            color:'rgb(238,232,170)',
            info:[]
        },
        {
            name:'群体5',
            color:'rgb(250,128,114)',
            info:[]
        },*/
    ],
    generator(ammount, average) {
        //ammount为总人数，average为每个基站平均人数,attrs为人群聚类数
        return this.formatter();
        this.originData = [];
        var attrs = this.attrs.length;
        var heatmapData = [];
        var x = 116.40964;
        var y = 39.904979;
        var nowid = 0;
        for (var i = 0; i < 500; i++) {
            var x_ = 0;
            var y_ = 0;
            x_ = Math.random() * 0.5 - 0.25;
            y_ = Math.random() * 0.5 - 0.25;
            var count = Math.round(Math.random() * average);
            if ((nowid + count) > ammount) {
                count = ammount - nowid;
            }
            var pointdata = {
                'lng': x + x_,
                'lat': y + y_,
                'count': count,
                'info': []
            };
            for (var j = 0; j < count; j++) {
                var id = nowid;
                nowid++;
                var attr = Math.floor(Math.random() * attrs);
                pointdata.info.push({
                    'id': nowid,
                    'attr': attr
                });
            }
            this.originData.push(pointdata);
        }
        return this.originData;
    },
    isInCircle(LngLat,center,radius){
        //检查一个点是否在圆内快捷函数
          var distance = AMap.GeometryUtil.distance(LngLat, center);
          if(distance < radius){
            return true;
          }else{
            return false;
          }
      },
    formatter_arrest(target,index){
        //读取数据并转换为热力格式
        console.log("/src/data/arrest" + index + ".json");
        d3.json("/src/data/arrest" + index + ".json")
            .then(function(data){
                console.log(data);
                var arrestData = [];
                var min = 10000;
                var max = 0;
                for(var userID in data){
                    //一个ID
                    var outArray = data[userID];
                    var userData = {
                        id:userID,
                        arrests:[]
                    }
                    outArray.forEach(function(inArray){
                        //一组驻点，遍历求出大圆半径
                        var location = inArray[0];
                        var anArrest = {
                            timestamps:[],
                            location:new AMap.LngLat(location[0],location[1])
                        }
                        inArray.forEach(function(point){
                            //一个点
                            anArrest.timestamps.push(point[2]);
                        },this);
                        var length = anArrest.timestamps.length;
                        if(length > max){
                            max = length;
                        }
                        if(length < min){
                            min = length;
                        }
                        userData.arrests.push(anArrest);
                    },this)
                    arrestData.push(userData);
                }
                target.loadArrestData(arrestData,min,max);
            });
    },
    formatter(target,index){
        //读取数据并转换为热力格式
        console.log("/src/data/trip" + index + ".json");
        d3.json("/src/data/trip" + index + ".json")
            .then(function(data){
                console.log(data);
                var countMap = new Map();
                var heatmapData = [];
                for(var userID in data){
                    var outArray = data[userID];
                    outArray.forEach(function(e,index){
                            var n;
                            if(isNaN(e[0])){
                                console.log(userID);
                                console.log(index);
                            }
                            var location = new AMap.LngLat(e[0],e[1]);
                            if(countMap.has(location)){
                                n=countMap.get(location);
                            }else{
                                n=[];
                            }
                            n.push({
                                'id': userID,
                                'attr': 0
                            });
                            countMap.set(location,n);
                    },this)
                }
                
                var heatmapdata = [];
                countMap.forEach(function(value,key,map) {
                heatmapdata.push({
                        'lng': key.lng,
                        'lat': key.lat,
                        'count': value.length,
                        'info':value
                    })
                });
                target.loadHeatMap(heatmapdata);
            });
    }
}
export {
    dataGenerator
}