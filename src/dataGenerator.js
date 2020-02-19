import AMap from 'AMap';   //在页面中引入高德地图
import * as d3 from 'd3';//引入d3
var dataGenerator = {
    //随机数据生成器
    originData: [],//初始数据
    generator(ammount, average, attrs) {
        //ammount为总人数，average为每个基站平均人数,attrs为人群聚类数
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
                var attr = Math.round(Math.random() * attrs);
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
    formatter(){
        d3.csv("/dist/data.csv", function(data) {console.log(data)});
    }
}
export {
    dataGenerator
}