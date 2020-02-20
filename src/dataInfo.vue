<template>
    <div id="infoList" class="strbox">
        <div class="centeritems"  v-for="(typeitem,index) in typeinfo">
        <input type="checkbox" checked="checked" class="checkbox" v-on:change="changeGroups(index,$event)" />
        <p class="boxtext centeritem" style="display:inline;vertical-align: middle;" v-on:click="showIDs(index)">{{typeitem.name}}▼</p>
        <svg width="100%" height="30px" class="lineSvg">
            <line x1="0" y1="50%" v-bind:x2="typeitem.percent + '%'" y2="50%" v-bind:style="{ stroke: typeitem.color }" class="colorbar" />
            <text x="80%" y="55%" fill="white" class="littlenumber">{{typeitem.percent}}%</text>
        </svg>
        <div id="displayID" class="strbox" v-show="isunfold[index]">
            <div v-for="item in typeitem.info">
            <input type="checkbox"  class="checkbox" v-bind:value="item" v-on:change="changeIDs(item,$event)" v-model="checkedIDs[index]" />
            <p class="boxtext" style="font-size:12px;display:inline;vertical-align: middle;">{{item.id}}</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

export default {
    mounted(){

    },
    data(){
        return {
            typeinfo:'',
            isunfold:[],
            checkedIDs:[],
            heatMap:'',
        }
    },
    methods:{
        countInfo(typeinfo){
            this.checkedIDs = [];
            var summary = 0;
            for(var i=0;i<typeinfo.length;i++){
               summary = summary + typeinfo[i].info.length; 
               this.isunfold[i] = false;
            }
            for(var i=0;i<typeinfo.length;i++){
                var e = typeinfo[i];
               var percent = Math.round((e.info.length/summary) * 100);
                e.percent = percent;
                this.checkedIDs.push([]);
                e.info.forEach(h=>{
                    this.checkedIDs[i].push(h);
                },this);
            }
            this.typeinfo = [];
            this.typeinfo = typeinfo;
            this.initHeatData();
        },
        showIDs(index){
            this.$set(this.isunfold,index,!this.isunfold[index]);
        },
        initHeatData(){
            //初始化坐标数据
            var countMap = new Map();
            for(var i=0;i<this.typeinfo.length;i++){
            this.checkedIDs[i].forEach(e=>{
                var n;
                if(countMap.has(e.location)){
                    n=countMap.get(e.location);
                }else{
                    n=0;
                }
                countMap.set(e.location,n+1);
            },this);
            }
            this.heatMap = countMap;
            this.fromDataToHeat();
        },
        changeIDs(item,event){
            //ID选中改变时触发
            var n;
            if(this.heatMap.has(item.location)){
                n=this.heatMap.get(item.location);
            }else{
                n=0;
            }
            if(event.target.checked){
                this.heatMap.set(item.location,n+1)
            }else{
                this.heatMap.set(item.location,n-1)
            }
            this.fromDataToHeat();
        },
        changeGroups(index,event){
            this.checkedIDs[index].splice(0,this.checkedIDs[index].length);
            if(event.target.checked){
                this.typeinfo[index].info.forEach(h=>{
                    this.checkedIDs[index].push(h);
                },this);
            }else{

            }
            this.initHeatData();
        },
        fromDataToHeat(){
            //重绘函数
            var heatmapdata = [];
            var countMap = this.heatMap;
            countMap.forEach(function(value,key,map) {
            heatmapdata.push({
                    'lng': key.lng,
                    'lat': key.lat,
                    'count': value,
                })
            })
            this.$emit('func',heatmapdata);//将重绘数据传给父组件
            }
        
    },
    props:{
        /*typeinfo:{
            type:Array
        }*/
    }
}
</script>

<style>
    
#infoList{
  width:100%;
  height:390px;
  overflow:auto;
}

.centeritems{
  margin-top:5px;
  cursor: pointer;
}
.centeritem{
  font-size: 15px;
  text-align:center;
  height:15px;
    margin-top:0;
}
.lineSVG{
    display:inline;
}
.littlenumber{
    display:inline;
    font-size: 12px;
}
.colorbar{
  stroke-width:12;
}
#displayID{
    width:100%;
    height:200px;
    overflow:auto;
    justify-content: center;
    align-items:center;
}
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  -webkit-appearance: none;
  background: url("./img/check-no.png")
    no-repeat center;
  background-size: 100% 100%;
  outline: none;
}
input[type="checkbox"]:checked {
  background: url("./img/check-yes.png")
    no-repeat center;
  background-size: 100% 100%;
}
.checkbox{
   vertical-align: middle;
}
/*滚动条整体部分*/

.strbox::-webkit-scrollbar{

width:15px;

height:15px;

background-color: rgb(73, 73, 73);

}

/*滚动条两端的按钮*/

.strbox::-webkit-scrollbar-button{

background-color:#6ff1c8;

}

/*外层轨道*/

.strbox::-webkit-scrollbar-track{

background-color:#6ff1c8;

}

/*内层轨道*/

.strbox::-webkit-scrollbar-track-piece{

background-color:#383838;

}

/*滚动条里面可以拖动的那部分*/

.strbox::-webkit-scrollbar-thumb{

background-color:#128560;

border-radius: 4px;

}

/*边角*/

.strbox::-webkit-scrollbar-corner{

background-color:#82afff;

}

/*定义右下角拖动块的样式*/

.strbox::-webkit-scrollbar-resizer{

background-color: #ff0bee;

}

</style>