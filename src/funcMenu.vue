<template>
  <quick-menu :menu-count="count" 
        :icon-class="icons" 
        :menu-url-list="list" @process=print>
  </quick-menu>
</template>
<script>
import Vue from 'vue'
import quickMenu from 'vue-quick-menu'
import 'font-awesome/css/font-awesome.min.css'
export default {
  components: {
    quickMenu
  },
  data() {
      return {
        count:4,
        icons:["fa icon-pathtool","fa icon-arresttool",
               "fa icon-heatmaptool","fa icon-addition","fa icon-medical"],
        list:["http://jd.com",
            "http://jd.com",
            "http://jd.com",
            "http://jd.com",
            "http://jd.com"],
        backgroundColor:'#3e8e41',
        color:'#eee',
        position:'top-right',
        isOpenNewTab:false
      }
  },
   methods:{
      print(key){
        if(key == 0){
           this.$emit('react',"path");
        } else if (key == 1){
          this.$emit('react',"arrest");
        }else if(key == 2)
        {
          this.$emit('react',"heatmap");
        }else if (key == 3){
          this.$emit('react',"addition");
        }
      }

  }
}    
</script>
<style>
.icon-heatmaptool:before 
{
  content: "";
  display: block;
  height: 40px;
  width: 40px;
  background: url(./img/heatmaptool.png) no-repeat;
  background-size: 100%;
}
.icon-pathtool:before 
{
  content: "";
  display: block;
  height: 40px;
  width: 40px;
  background: url(./img/pathtool.png) no-repeat;
  background-size: 100%;
}
.icon-arresttool:before 
{
  content: "";
  display: block;
  height: 40px;
  width: 40px;
  background: url(./img/arresttool.png) no-repeat;
  background-size: 100%;
}
.icon-commerce:before 
{
  content: "";
  display: block;
  height: 40px;
  width: 40px;
  background: url(./img/commercial.png) no-repeat;
  background-size: 100%;
}
.icon-addition:before 
{
  content: "";
  display: block;
  height: 40px;
  width: 40px;
  background: url(./img/addition.png) no-repeat;
  background-size: 100%;
}
</style>