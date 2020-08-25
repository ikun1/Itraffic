<template>
      <div v-bind:style="{left : left}"  class="floatToolBar toolBox">
        <p class="boxtext boxtitle">驻点分析工具</p>
        <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle">日期:</p>
            <p class="boxtext boxsubtitle" style="width:200px">2018/10/03</p>
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
            <p class="boxtext boxsubtitle">显示模式:</p>
            <div  class="fillbox">
            <el-switch
              style="display: block"
              v-model="modevalue"
              active-color="#158d97"
              inactive-color="#158d97"
              color="white"
              active-text="显示群体"
              v-on:change="changeMode"
              inactive-text="显示热度">
            </el-switch>
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
        <!--<div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle" style="margin-top:10px">范围分析</p>
            <img id="rangeButton" v-on:click="reactRange" class="boxtext boxsubtitle rangeButton" src="./img/range.png"  />
          </div>
        </div>
        <div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;margin-bottom:10px">
            <p class="boxtext boxsubtitle" style="margin-top:10px;">驻点迁移</p>
            <img  v-on:click="reactTime" class="boxtext boxsubtitle rangeButton retagleButton" src="./img/timelapses.png"  />
          </div>
            </div>-->
    <div class="linkbox" style="margin-top:20px">
            <a v-on:click="reactRange" class="a iconbg1">
              <span></span>
              <span></span>
              <span></span>
              <span></span> 范围分析
            </a>
          </div>
          <div class="linkbox" style="margin-top:10px;margin-bottom:20px">
            <a v-on:click="reactTime" class="a iconbg2">
              <span></span>
              <span></span>
              <span></span>
              <span></span> 驻点迁移
            </a>
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
                modevalue:true
        }
    },
    methods:{
        reactRange(){
          this.$emit('range',"arrest");
        },
        reactTime(){
          this.$emit('time');
        },
        changeMode(){
          console.log("hello");
          this.$emit('redrawArrest');
        }
    },
    props:{
        left:{
            type:String
        }
    }
}
</script>


