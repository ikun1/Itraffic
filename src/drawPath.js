// var p_timer; //定时器变量

// //触发定时器
// var move = function(){
//     p_timer = window.setInterval("drawSinglePath()", 300)
// }

//     <title>轨迹回放</title>
//     <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"/>
//     <style>

//         .input-card .btn{
//             margin-right: 1.2rem;
//             width: 9rem;
//         }

//         .input-card .btn:last-child{
//             margin-right: 0;
//         }
//     </style>

// <div id="container"></div>

//     var marker;

//     marker = new AMap.Marker({
//         map: map,
//         position: [116.478935,39.997761],
//         icon: "https://webapi.amap.com/images/car.png",
//         offset: new AMap.Pixel(-26, -13),
//         autoRotation: true,
//         angle:-90,
//     });

//     // 绘制轨迹
//     var polyline = new AMap.Polyline({
//         map: map,
//         path: lineArr,
//         showDir:true,
//         strokeColor: "#28F",  //线颜色
//         // strokeOpacity: 1,     //线透明度
//         strokeWeight: 6,      //线宽
//         // strokeStyle: "solid"  //线样式
//     });

//     var passedPolyline = new AMap.Polyline({
//         map: map,
//         // path: lineArr,
//         strokeColor: "#AF5",  //线颜色
//         // strokeOpacity: 1,     //线透明度
//         strokeWeight: 6,      //线宽
//         // strokeStyle: "solid"  //线样式
//     });


//     marker.on('moving', function (e) {
//         passedPolyline.setPath(e.passedPath);
//     });

//     map.setFitView();

//     function startAnimation () {
//         marker.moveAlong(lineArr, 200);
//     }

//     function pauseAnimation () {
//         marker.pauseMove();
//     }

//     function resumeAnimation () {
//         marker.resumeMove();
//     }

//     function stopAnimation () {
//         marker.stopMove();
//     }

/*
    input:驻留的时间、移动的交通方式、
*/ 