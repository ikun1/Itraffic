<template>
      <div v-bind:style="{left : left}"  class="floatToolBar toolBox">
        <p class="boxtext boxtitle">附加功能</p>
        <hr align="center" width="100%" color="#987cb9" SIZE="1" />
      <div class="panel-group wrap" id="accordion" role="tablist" aria-multiselectable="true">
		      <div class="panel">
		        <div class="panel-heading" role="tab" id="headingOne">
		          <h4 class="panel-title">
		        <a v-on:click="clickTap('headingOne')" class="mya" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <img src="./img/commercial.png" style="width:40px;height:40px;display:inline"/>
              商业功能
		        </a>
		      </h4>
		        </div>
		        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
		          <div class="panel-body">
		            <div style="width:100%">
            <p class="boxtext boxsubtitle littletip">选择店铺目标群体，为您分析建议的商铺落点：</p>
             <div id="infoList" class="strbox">
                <div class="centeritems"  v-for="(typeitem,index) in typeinfo" v-bind:key="index">
                <input type="checkbox" v-on:change="changeGroups(index,$event)" class="checkbox"/>
                <p class="boxtext centeritem" style="display:inline;vertical-align: middle;" v-on:click="showIDs(index)">{{typeitem.name}}▼</p>
                
                <div id="displayID" class="strbox" style="height:150px;" v-show="isunfold[index]">
                    <div v-for="(item,mykey) in typeitem.info" v-bind:key="mykey">
                      <img  class="checkbox" width="10px" height="10px" src="./img/individual.png"/>
                    <p class="boxtext" style="font-size:12px;display:inline;vertical-align: middle;">{{item.id}}</p>
                    </div>
                </div>
                </div>
            </div>
          </div>
          <div class="linkbox" style="margin-top:20px;margin-bottom:20px">
            <a  v-on:click="beginAnalyze(1)" class="a iconbg3">
              <span></span>
              <span></span>
              <span></span>
              <span></span> 开始分析
            </a>
          </div>
      <div class="boxitem">
      <p class="boxtext boxsubtitle">图例:</p>
      <div
        style="display: flex; align-items: center; margin-left: 40px; min-height: 33px; font: 10px sans-serif;"
      >
        <div style="width: 100%; columns: 180px;">
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:rgb(237,39,0);"></div>
            <div class="boxtext O-1-label" title="Leisure and hospitality">热门落点</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:rgb(237,201,0);"></div>
            <div class="boxtext O-1-label" title="Business services">建议落点</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:rgb(45,63,83);"></div>
            <div class="boxtext O-1-label" title="Construction">可选落点</div>
              </div>
            </div>
          </div>
            </div>
                 </div>
		        </div>
		      </div>
		      <!-- end of panel -->

		      <div class="panel">
		        <div class="panel-heading active" role="tab" id="headingTwo">
		          <h4 class="panel-title">
		        <a class="collapsed mya" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
		          <img src="./img/medical.png" style="width:40px;height:40px;display:inline"/>
              医疗功能
		        </a>
		      </h4>
		        </div>
		        <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
		          <div class="panel-body">
		           <div class="boxitem">
                <div style="width:100%">
                  <p class="boxtext boxsubtitle littletip" >防疫病原追踪：锁定已知病原携带者，给出可疑接触个体及防疫建议</p>
                </div></div>
                <div class="linkbox" style="margin-top:20px;margin-bottom:20px">
            <a  v-on:click="beginAnalyze(2)" class="a iconbg3">
              <span></span>
              <span></span>
              <span></span>
              <span></span> 开始分析
            </a>
          </div>
               </div>
		        </div>
		      </div>
		      <!-- end of panel -->

		      <div class="panel">
		        <div class="panel-heading" role="tab" id="headingThree">
		          <h4 class="panel-title">
		        <a class="collapsed mya" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
		          <img src="./img/gather.png" style="width:40px;height:40px;display:inline"/>
              聚集分析
		        </a>
		      </h4>
		        </div>
		        <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
		          <div class="panel-body">
		           <div class="boxitem">
          <div style="width:100%">
            <p class="boxtext boxsubtitle littletip" >分析异常聚集原因，给出可靠疏散建议</p>
          </div></div>
          <div class="linkbox" style="margin-top:20px;margin-bottom:20px">
            <a v-on:click="beginGather" class="a iconbg3">
              <span></span>
              <span></span>
              <span></span>
              <span></span> 开始分析
            </a>
          </div>
           
                </div>
		        </div>
		      </div>
		      <!-- end of panel -->


		    </div>
		    <!-- end of #accordion -->



       </div>
</template>

<script>
import * as d3 from 'd3';
import $ from 'jquery'
export default {
    mounted(){
      d3.selectAll(".el-button--primary").style("background-color", "#158d97").style("border-color", "#158d97");
       $('.collapse.in').prev('.panel-heading').addClass('active');
		  $('#accordion, #bs-collapse')
		    .on('show.bs.collapse', function(a) {
		      $(a.target).prev('.panel-heading').addClass('active');
		    })
		    .on('hide.bs.collapse', function(a) {
		      $(a.target).prev('.panel-heading').removeClass('active');
        });
        console.log("mount");
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
                checkedGroups:[]
        }
    },
    methods:{
      mounted(){
      



      },
      clickTap(id){
        $("#headingOne").tab("show");
        $('#' + id).prev('.panel-heading').addClass('active');
        console.log(id)
      },
        reactRange(){
          this.$emit('range',"arrest");
        },
        reactTime(){
        },
        showIDs(index){
            this.$set(this.isunfold,index,!this.isunfold[index]);
        },
        changeGroups(index,event){
          if(event.target.checked){
              this.checkedGroups.push(index);
          }else{
              this.checkedGroups.forEach(function(data,i){
                if(data == index)
                {
                  this.checkedGroups.splice(i,1);
                }
              },this);
          }
        },
        beginAnalyze(ind){
          if(ind==1)
          this.$emit('loadCommerce',this.checkedGroups);
          else if(ind == 2)
          this.$emit('beginMedical');
        },
        beginGather(){
          this.$emit('beginGather');
        }
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

.el-button--primary{
  background-color: #158d97;
  border-color: #158d97;
}

.el-button--primary:active{
  background-color: #158d97;
  border-color: #158d97;
}

.mya:hover { color: #2a6858; text-decoration: none; }/* 鼠标移动到链接上 */

</style>