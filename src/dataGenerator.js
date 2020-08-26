import AMap from 'AMap';   //在页面中引入高德地图
import * as d3 from 'd3';//引入d3
var dataGenerator = {
    //随机数据生成器
    originData: [],//初始数据
    arrestData:'',
    cacheheat:'',
    arrestDescript:'',
    nowIndex:25,
    line1:[{"Q":41.800610475365566,"R":123.35612103536727,"lng":123.356121,"lat":41.80061},{"Q":41.79792308644949,"R":123.36178586080672,"lng":123.361786,"lat":41.797923},{"Q":41.7955555314141,"R":123.36676404073836,"lng":123.366764,"lat":41.795556},{"Q":41.794275735520095,"R":123.3706264217198,"lng":123.370626,"lat":41.794276},{"Q":41.78915629640008,"R":123.38229939535262,"lng":123.382299,"lat":41.789156},{"Q":41.78282042443671,"R":123.3977489192784,"lng":123.397749,"lat":41.78282},{"Q":41.77507573063902,"R":123.41620251730086,"lng":123.416203,"lat":41.775076},{"Q":41.77168313318515,"R":123.42349812582137,"lng":123.423498,"lat":41.771683},{"Q":41.77168313318515,"R":123.42495724752547,"lng":123.424957,"lat":41.771683},{"Q":41.77142708073641,"R":123.4263305385411,"lng":123.426331,"lat":41.771427},{"Q":41.77136306746452,"R":123.43577191427352,"lng":123.435772,"lat":41.771363},{"Q":41.77104300014684,"R":123.4428100307286,"lng":123.44281,"lat":41.771043},{"Q":41.76118414468399,"R":123.44220921590926,"lng":123.442209,"lat":41.761184},{"Q":41.76105609763496,"R":123.44538495138289,"lng":123.445385,"lat":41.761056},{"Q":41.75990366269571,"R":123.44650075033309,"lng":123.446501,"lat":41.759904},{"Q":41.75900731010104,"R":123.44658658102156,"lng":123.446587,"lat":41.759007},{"Q":41.75695845715665,"R":123.4475307185948,"lng":123.447531,"lat":41.756958},{"Q":41.758046918427716,"R":123.45001980856063,"lng":123.45002,"lat":41.758047},{"Q":41.75932743746495,"R":123.45345303609969,"lng":123.453453,"lat":41.759327},{"Q":41.76003171204436,"R":123.45860287740828,"lng":123.458603,"lat":41.760032},{"Q":41.76041585855716,"R":123.46340939596297,"lng":123.463409,"lat":41.760416},{"Q":41.7604798827524,"R":123.47113415792586,"lng":123.471134,"lat":41.76048},{"Q":41.76041585855716,"R":123.47285077169539,"lng":123.472851,"lat":41.760416},{"Q":41.75734262106571,"R":123.47731396481396,"lng":123.477314,"lat":41.757343}],
    circle1:[{"Q":41.80073384260697,"R":123.35603719353674,"lng":123.356037,"lat":41.800734},{"Q":41.77052628610027,"R":123.44272618755696,"lng":123.442726,"lat":41.770526},{"Q":41.75724180801239,"R":123.47729304090143,"lng":123.477293,"lat":41.757242}],
    line2:[{"Q":41.77852769040189,"R":123.33088883534072,"lng":123.330889,"lat":41.778528},{"Q":41.77929575964519,"R":123.3382702745497,"lng":123.33827,"lat":41.779296},{"Q":41.77865570258127,"R":123.34187516346572,"lng":123.341875,"lat":41.778656},{"Q":41.78543998242192,"R":123.34496506825087,"lng":123.344965,"lat":41.78544},{"Q":41.78953580385409,"R":123.34788331165907,"lng":123.347883,"lat":41.789536},{"Q":41.7946552126655,"R":123.351831523329,"lng":123.351832,"lat":41.794655},{"Q":41.7987504453265,"R":123.3544064439833,"lng":123.354406,"lat":41.79875},{"Q":41.801053898701205,"R":123.35612305775282,"lng":123.356123,"lat":41.801054},{"Q":41.80386911816066,"R":123.35886963978407,"lng":123.35887,"lat":41.803869},{"Q":41.8079637620292,"R":123.36178788319228,"lng":123.361788,"lat":41.807964},{"Q":41.81173828002173,"R":123.36487778797743,"lng":123.364878,"lat":41.811738},{"Q":41.81340155633467,"R":123.36153039112685,"lng":123.36153,"lat":41.813402},{"Q":41.81442508952143,"R":123.35869797840712,"lng":123.358698,"lat":41.814425},{"Q":41.81538463702926,"R":123.35457810536025,"lng":123.354578,"lat":41.815385},{"Q":41.82235691713686,"R":123.35775384083388,"lng":123.357754,"lat":41.822357},{"Q":41.82561891595326,"R":123.35964211598036,"lng":123.359642,"lat":41.825619},{"Q":41.82939239352194,"R":123.36127289906142,"lng":123.361273,"lat":41.829392},{"Q":41.83342145452954,"R":123.36298951283095,"lng":123.36299,"lat":41.833421},{"Q":41.835403915262354,"R":123.36393365040419,"lng":123.363934,"lat":41.835404},{"Q":41.83719447217799,"R":123.36547860279677,"lng":123.365479,"lat":41.837194},{"Q":41.83738631459061,"R":123.3657360948622,"lng":123.365736,"lat":41.837386}],
    line3:[{"Q":41.78771502554369,"R":123.41938616260887,"lng":123.419386,"lat":41.787715},{"Q":41.78470709677391,"R":123.41844202503563,"lng":123.418442,"lat":41.784707},{"Q":41.77747469052222,"R":123.40951563343407,"lng":123.409516,"lat":41.777475},{"Q":41.771457731068544,"R":123.42359186634422,"lng":123.423592,"lat":41.771458},{"Q":41.77152174424596,"R":123.42608095631005,"lng":123.426081,"lat":41.771522},{"Q":41.77132970452203,"R":123.43569399341942,"lng":123.435694,"lat":41.77133},{"Q":41.764287852965154,"R":123.43483568653465,"lng":123.434836,"lat":41.764288},{"Q":41.76211112367124,"R":123.43552233204247,"lng":123.435522,"lat":41.762111},{"Q":41.76031846762994,"R":123.4343207024038,"lng":123.434321,"lat":41.760318},{"Q":41.75839770915491,"R":123.43535067066551,"lng":123.435351,"lat":41.758398},{"Q":41.75378765425835,"R":123.43912722095848,"lng":123.439127,"lat":41.753788},{"Q":41.75327540549604,"R":123.43414904102684,"lng":123.434149,"lat":41.753275},{"Q":41.75378765425835,"R":123.43127371028066,"lng":123.431274,"lat":41.753788},{"Q":41.75413982291102,"R":123.43032957270742,"lng":123.43033,"lat":41.75414},{"Q":41.75545243450255,"R":123.42779756739736,"lng":123.427798,"lat":41.755452},{"Q":41.75343548167243,"R":123.42412586197258,"lng":123.424126,"lat":41.753435},{"Q":41.75101635369506,"R":123.42758429288864,"lng":123.427584,"lat":41.751016},{"Q":41.74986373846963,"R":123.42732680082321,"lng":123.427327,"lat":41.749864},{"Q":41.74986373846963,"R":123.42732680082321,"lng":123.427327,"lat":41.749864}],
    line4:[{"Q":41.83813282190096,"R":123.51959124773742,"lng":123.519591,"lat":41.838133},{"Q":41.83685387653954,"R":123.5237111207843,"lng":123.523711,"lat":41.836854},{"Q":41.83212155646978,"R":123.52611438006164,"lng":123.526114,"lat":41.832122},{"Q":41.82879593304392,"R":123.52800265520813,"lng":123.528003,"lat":41.828796},{"Q":41.8245747006584,"R":123.53435412615534,"lng":123.534354,"lat":41.824575},{"Q":41.82303963805805,"R":123.53589907854797,"lng":123.535899,"lat":41.82304},{"Q":41.817410760324705,"R":123.5372723695636,"lng":123.537272,"lat":41.817411},{"Q":41.81459613591475,"R":123.53813067644836,"lng":123.538131,"lat":41.814596},{"Q":41.80563968987766,"R":123.54534045428039,"lng":123.54534,"lat":41.80564},{"Q":41.80103303002526,"R":123.5511769410968,"lng":123.551177,"lat":41.801033},{"Q":41.79770579193438,"R":123.55289355486633,"lng":123.552894,"lat":41.797706},{"Q":41.78951493142748,"R":123.5625065919757,"lng":123.562507,"lat":41.789515},{"Q":41.78337109915272,"R":123.57040301531555,"lng":123.570403,"lat":41.783371},{"Q":41.77441028839932,"R":123.55735675066705,"lng":123.557357,"lat":41.77441},{"Q":41.77082561351483,"R":123.5511769410968,"lng":123.551177,"lat":41.770826},{"Q":41.76160695822651,"R":123.53813067644836,"lng":123.538131,"lat":41.761607},{"Q":41.75187471842184,"R":123.52508441179987,"lng":123.525084,"lat":41.751875},{"Q":41.746751894176384,"R":123.51650134295227,"lng":123.516501,"lat":41.746752},{"Q":41.74419032875478,"R":123.50139514178039,"lng":123.501395,"lat":41.74419},{"Q":41.75597268147887,"R":123.4989918838441,"lng":123.498992,"lat":41.755973},{"Q":41.763143490759624,"R":123.49693194732072,"lng":123.496932,"lat":41.763143},{"Q":41.76109476987143,"R":123.48319903716441,"lng":123.483199,"lat":41.761095},{"Q":41.7569971318625,"R":123.47770587310197,"lng":123.477706,"lat":41.756997},{"Q":41.757253242903744,"R":123.47701922759416,"lng":123.477019,"lat":41.757253}],
    polygon:[{"Q":41.8167071488021,"R":123.41974327191713,"lng":123.419743,"lat":41.816707},{"Q":41.81056592315067,"R":123.4035641871393,"lng":123.403564,"lat":41.810566},{"Q":41.80141696398757,"R":123.4035641871393,"lng":123.403564,"lat":41.801417},{"Q":41.7991455164574,"R":123.41360637769105,"lng":123.413606,"lat":41.799146},{"Q":41.80224874153399,"R":123.43068668469789,"lng":123.430687,"lat":41.802249},{"Q":41.81469212404071,"R":123.43124458417299,"lng":123.431245,"lat":41.814692},{"Q":41.81833831288978,"R":123.42794010266664,"lng":123.42794,"lat":41.818338},{"Q":41.8168670686868,"R":123.41970035657289,"lng":123.4197,"lat":41.816867},{"Q":41.81654722851805,"R":123.41974327191713,"lng":123.419743,"lat":41.816547}],
    commercePoint:[//存放商铺建议点数据
        {
            target:[0],//单单群体一时的建议点
            point:new AMap.LngLat(123.450078,41.823319),
            descript:"沈阳市沈河区南二经街",
            type:0,//type分为0，1，2三个阶层，划分不同的建议度
            val1:40,
            val2:80
        },
        {
            target:[0],//单单群体一时的建议点
            point:new AMap.LngLat(123.421378,41.837492),
            descript:"沈阳市沈河区南二经街",
            type:1,
            val1:40,
            val2:80
        },
        {
            target:[0],//单单群体一时的建议点
            point:new AMap.LngLat(123.409614,41.823732),
            descript:"沈阳市沈河区南二经街",
            type:2,//type分为0，1，2三个阶层，划分不同的建议度
            val1:40,
            val2:80
        },
        {
            target:[0],//单单群体一时的建议点
            point:new AMap.LngLat(123.421258,41.78594),
            descript:"沈阳市沈河区南二经街",
            type:1,//type分为0，1，2三个阶层，划分不同的建议度
            val1:40,
            val2:80
        },
    ],
    attrs: [
        {
            name: '群体1',
            color: 'rgb(153,50,204)',
            info: []
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
    addHeat(e){
        this.cacheheat[""+this.nowIndex]=e;
        this.nowIndex++;
        console.log(this.cacheheat);
    },
    save(){
        console.log(JSON.stringify(this.cacheheat));
    },
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
    isInCircle(LngLat, center, radius) {
        //检查一个点是否在圆内快捷函数
        var distance = AMap.GeometryUtil.distance(LngLat, center);
        if (distance < radius) {
            return true;
        } else {
            return false;
        }
    },
    loadArrest(target){
        d3.json("/src/data/timeDict.json")
            .then(function (data) {
                var count = 0;
                for(var i in data) {
                    if(data.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
                        count++;
                    }
                }
                data.count=count;
                target.timelapses = data;
            });
    },
    formatter_arrest(target, index) {
        var cache = this;
        d3.json("/src/data/arrest" + index + ".json")
            .then(function (data) {
                var arrestData = [];
                var min = 10000;
                var max = 0;
                for (var userID in data) {
                    //一个ID
                    var outArray = data[userID];
                    var userData = {
                        id: userID,
                        arrests: [],
                        attr:0
                    }
                    outArray.forEach(function (inArray,index) {
                        //一组驻点，遍历求出大圆半径
                        var location = inArray[0];
                        var anArrest = {
                            timestamps: [],
                            location: new AMap.LngLat(location[0], location[1]),
                            hours:0
                        }
                        inArray.forEach(function (point) {
                            //一个点
                            anArrest.timestamps.push(point[2]);
                        }, this);
                        var length = cache.arrestData[userID][index];
                        anArrest.hours = length;
                        if (typeof(length) == "undefined"){
                            console.log(userID);
                            console.log(index);
                        }
                        if (length > max) {
                            max = length;
                        }
                        if (length < min) {
                            min = length;
                        }
                        userData.arrests.push(anArrest);
                    }, this)
                    arrestData.push(userData);
                }
                target.initArrestData(arrestData, min, max);
            });
    },
    formatter_heat(target,index,typeout){
        if(this.cacheheat == ''){
            var cache = this;
            d3.json("/src/data/heatdata1.json")
            .then(function (data) {
                cache.cacheheat = data;
                var attributeCount = function(obj) {
                    var count = 0;
                    for(var i in obj) {
                        if(obj.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
                            count++;
                        }
                    }
                    return count;
                }
            
                target.maxheatmap = attributeCount(data)+1;
                cache.formatter_heat(target,index,typeout);
            },this)
        }else{
            console.log(index);
            console.log(typeout)
            var origindata = this.cacheheat[""+index];
            console.log(origindata);
            if($.isEmptyObject(origindata[0].count)){
                origindata.forEach(function(data){
                    data.count = data.frequency;
                    data.info = ['deafault'];
                },this)
            }
           
            if(typeout==1){
            target.loadHeatMap(origindata);
            }else if(typeout==2){
                target.readyheatmapdata = origindata;
            }else if(typeout==3){
                target.beginHeat(origindata);
            }

        }
    },
    getHeatData(){

    },
    loadArrestDescript(){
        var tac = this;
        d3.json("/src/data/point.json").then(function(data){
            tac.arrestDescript = data;
        })
    },
    formatter(target, index) {
        //读取数据并转换为热力格式
        d3.json("/src/data/trip" + index + ".json")
            .then(function (data) {
                console.log(data);
                var countMap = new Map();
                var heatmapData = [];
                for (var userID in data) {
                    var outArray = data[userID];
                    outArray.forEach(function (e, index) {
                        var n;
                        if (isNaN(e[0])) {
                            console.log(userID);
                            console.log(index);
                        }
                        var location = new AMap.LngLat(e[0], e[1]);
                        if (countMap.has(location)) {
                            n = countMap.get(location);
                        } else {
                            n = [];
                        }
                        n.push({
                            'id': userID,
                            'attr': 0
                        });
                        countMap.set(location, n);
                    }, this)
                }

                var heatmapdata = [];
                countMap.forEach(function (value, key, map) {
                    heatmapdata.push({
                        'lng': key.lng,
                        'lat': key.lat,
                        'count': value.length,
                        'info': value
                    })
                });
                console.log(heatmapdata);
                target.loadHeatMap(heatmapdata);
            });
    },
    mergeData(target,index){
        var cache = this;
        d3.json("/src/data/lastDict" + index + ".json")
            .then(function(data){
                cache.arrestData = data;
                cache.formatter_arrest(target,index);
        })
    }
}
export {
    dataGenerator
}