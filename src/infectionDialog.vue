<template>
      <transition name="el-fade-in-linear">
 <div v-show="show" v-bind:style="{ height: heightStyle + 'px'}" class="centralTool toolBox">
    <el-container>
  <el-header height="30px">
    <img class="downbtn" src="./img/down.png" />
  </el-header>

  <el-main>
    <el-row type="flex" justify="center">

        <span class="playText">请选择疑似传染源个体</span>

    </el-row>
    <el-row>
        <div id="infoList" class="strbox">
                <div class="centeritems"  v-for="(typeitem,index) in typeinfo" v-bind:key="index">
                <img  class="checkbox" width="15px" height="15px" src="./img/individual.png"/>
                <p class="boxtext centeritem" style="display:inline;vertical-align: middle;" v-on:click="showIDs(index)">{{typeitem.name}}▼</p>
                <div id="displayID" class="strbox" style="height:150px;" v-show="isunfold[index]">
                    <div v-for="(item,mykey) in typeitem.info" v-bind:key="mykey">
                      <input type="checkbox"  class="checkbox" v-bind:value="item" v-on:change="changeIDs(item,$event)" v-model="checkedIDs[index]" />
                    <p class="boxtext" style="font-size:12px;display:inline;vertical-align: middle;">{{item.id}}</p>
                    </div>
                </div>
                </div>
            </div>
      
    </el-row>
    <div v-show="showDetail">
    <el-row>
    <el-col :span="6"><span class="playtiptext">日期</span></el-col>
  <el-col :span="12">
          <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            style="width:150px"
            placeholder="疑似感染日期">
          </el-date-picker>
</el-col>
    </el-row>
    <el-row>
    <el-col :span="6"><span class="playtiptext">敏感度</span></el-col>
  <el-col :span="12"><el-input-number size="small" v-model="frameRate" :step="10" :min="0" :max="100" label="敏感度"></el-input-number></el-col>
    </el-row>
        </div>
    <el-row type="flex" style="margin-top:0px" justify="center">
      <el-button  v-on:click="confirm" type="primary">确认</el-button>
    </el-row>
  </el-main>
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
          typeinfo:'',
          isunfold:[],
          checkedIDs:[],
          checkedGroups:[],
          heightStyle:280,
          formResult:'',
          value2:''
        }
    },
    methods:{
        countInfo(){
          var typeinfo = this.typeinfo;
          for(var i=0;i<typeinfo.length;i++){
                var e = typeinfo[i];
                this.checkedIDs.push([]);
                
            }
        },
        showIDs(index){
            this.$set(this.isunfold,index,!this.isunfold[index]);
            if(this.isunfold[index]){
             this.heightStyle =  this.heightStyle + 150;
            }else{
               this.heightStyle =  this.heightStyle - 150;
            }
        },
        changeGroups(index,event){
          
        },
        changeIDs(item,event){
          console.log(this.checkedIDs[0]);
        },
        confirm(){
          this.$emit('confirm',this.checkedIDs);
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