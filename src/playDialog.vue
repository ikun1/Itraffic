<template>
      <transition name="el-fade-in-linear">
 <div v-show="show"  class="botToolBar toolBox">
    <el-container>
  <el-header height="30px">
    <img class="downbtn" src="./img/down.png" v-on:click="close"/>
  </el-header>

  <el-main>
    <el-row type="flex" justify="center">

        <span class="playText">播放进度</span>

    </el-row>
    <el-row>
        <el-slider @change="reaction"  v-model="progress"  :format-tooltip="formatTooltip"></el-slider>
      
    </el-row>
        <el-collapse-transition>
    <div v-show="showDetail">
    <el-row>
    <el-col :span="6"><span class="playtiptext">帧数</span></el-col>
  <el-col :span="12"><el-input-number size="small" v-model="frameNumber" :min="1" :max="20" label="过渡帧数"></el-input-number></el-col>
    </el-row>
    <el-row>
    <el-col :span="6"><span class="playtiptext">时间</span></el-col>
  <el-col :span="12"><el-input-number size="small" v-model="frameRate" :step="50" :min="50" :max="2000" label="过渡帧数"></el-input-number></el-col>
    </el-row>
        </div>
    </el-collapse-transition>
    <el-row type="flex" style="margin-top:15px" justify="center">
      <el-button  v-on:click="changeDetail()" type="primary">{{showDetail ? '开始播放' : '停止播放'}}</el-button>
    </el-row>
  </el-main>

  <el-footer height="3px">Footer</el-footer>
</el-container>
</div>
      </transition>
</template>

<script>
export default {
    mounted(){

    },
    data(){
        return {
          max:0,
          progress:0,
          frameNumber:10,
          frameRate:100,
          showDetail:true,
        }
    },
    methods:{
       formatTooltip(val) {
        return parseInt(val / 100 * this.max)+1;
      } ,
      formatNumber(val){
        return parseInt(val / this.max * 100)
      },
      reaction(val){
        console.log(val)
        this.$emit('change',this.formatTooltip(val));
      },
      changeDetail(){
        if(this.showDetail){
          //开始播放
          this.$emit('start',this.frameNumber,this.frameRate);
        }else{
          //停止播放
          this.$emit('stop');
        }
        this.showDetail=!this.showDetail;
      },
      close(){
         this.$emit('close');
      }
    },
    props:{
        show:{
            type:Boolean
        }
    }
}
</script>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 20px;
    height:5px;
  }

.el-row{
  padding-bottom: 5px;
  
}
.downbtn{
  width: 51px;
  height: 21px;
  cursor: pointer;
}
</style>