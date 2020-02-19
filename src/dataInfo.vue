<template>
    <div id="infoList">
        <div class="centeritems"  v-for="(typeitem,index) in typeinfo">
        <p class="boxtext centeritem" v-on:click="showIDs(index)">{{typeitem.name}}▼</p>
        <svg width="100%" height="30px" class="lineSvg">
            <line x1="0" y1="50%" v-bind:x2="typeitem.percent + '%'" y2="50%" v-bind:style="{ stroke: typeitem.color }" class="colorbar" />
            <text x="80%" y="55%" fill="white" class="littlenumber">{{typeitem.percent}}%</text>
        </svg>
        <div id="displayID" v-show="isunfold[index]">
            <li class="boxtext" style="font-size:12px" v-for="id in typeitem.info">{{id}}</li>
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
            isunfold:[]
        }
    },
    methods:{
        countInfo(typeinfo){
            var summary = 0;
            for(var i=0;i<typeinfo.length;i++){
               summary = summary + typeinfo[i].info.length; 
               this.isunfold[i] = false;
            }
            typeinfo.forEach(e => {
               var percent = Math.round((e.info.length/summary) * 100);
                e.percent = percent;
            });
            this.typeinfo = [];
            this.typeinfo = typeinfo;
            console.log(this.typeinfo);
        },
        showIDs(index){
            console.log("触发");
            this.$set(this.isunfold,index,!this.isunfold[index]);
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
}

.centeritems{
  width: 100%;
  margin-top:5px;
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
}

</style>