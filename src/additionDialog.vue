<template>
      <div v-bind:style="{left : left}"  class="floatToolBar toolBox">
        <p class="boxtext boxtitle">附加功能</p>
        <hr align="center" width="100%" color="#987cb9" SIZE="1" />
        <div class="boxitem">
          <p class="vice-title">商业功能</p>
        </div>
         <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">选择店铺目标群体：</p>
             <div id="infoList" class="strbox">
                <div class="centeritems"  v-for="(typeitem,index) in typeinfo" v-bind:key="index">
                <input type="checkbox" checked="checked" class="checkbox"/>
                <p class="boxtext centeritem" style="display:inline;vertical-align: middle;" v-on:click="showIDs(index)">{{typeitem.name}}▼</p>
                <svg width="100%" height="30px" class="lineSvg">
                    <line x1="0" y1="50%" v-bind:x2="typeitem.percent + '%'" y2="50%" v-bind:style="{ stroke: typeitem.color }" class="colorbar" />
                    <text x="80%" y="55%" fill="white" class="littlenumber">{{typeitem.percent}}%</text>
                </svg>
                <div id="displayID" class="strbox" style="height:150px;" v-show="isunfold[index]">
                    <div v-for="(item,mykey) in typeitem.info" v-bind:key="mykey">
                      <img  class="checkbox" width="10px" height="10px" src="./img/individual.png"/>
                    <p class="boxtext" style="font-size:12px;display:inline;vertical-align: middle;">{{item.id}}</p>
                    </div>
                </div>
                </div>
            </div>
          </div>
          <div class="fillbox">
            <el-button  v-on:click="beginAnalyze()" type="primary" round>开始评估</el-button>
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
                minicolor:'blue',//图例三种颜色
                midiumcolor:'rgb(0, 255, 0)',
                maxcolor:'red',
                mininumber:'0',//图例三种数字
                midiumnumber:'0',
                maxnumber:'0',
                 typeinfo:'',
                 isunfold:[],
                checkedIDs:[],
        }
    },
    methods:{
        reactRange(){
          this.$emit('range',"arrest");
        },
        reactTime(){
          this.$emit('time');
        },
        showIDs(index){
            this.$set(this.isunfold,index,!this.isunfold[index]);
        },
    },
    props:{
        left:{
            type:String
        }
    }
}
</script>

<style>
  .vice-title{
    font-size: 18px;
    text-align: center;
    display:inline;
    margin-left: 10px;
  }

    
#infoList{
  width:100%;
  height:auto;
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
    height:150px;
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
  background: url("./img/check-target.png")
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