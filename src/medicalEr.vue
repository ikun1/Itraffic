<template>
<transition name="el-fade-in-linear">
      <div v-show="show" v-bind:id="ids" class="medicalEr confrontBox" >
        <div style="display:inline">
          <img src="./img/individual.png" class="avatar" border="4"/>
          <div style="float:right;width:170px;margin-top:10px">
            <div>
          <p style="color:white;display:inline;">ID:</p>
          <p style="color:white;display:inline;">{{row.id}}</p>
            </div>
            <div style="margin-top:20px">
          <p style="color:white;display:inline">危险系数:</p>
            </div>
            <div id="myProgress">
              <div id="myBar" v-bind:style="{ width:row.dangerous +'%' }">{{row.dangerous}}%</div>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;margin-left:20px">
        <p style="color:white;margin-bottom:0;">可疑缘由:</p>
          <p style="color:white;margin-top:0;">{{row.adata}}</p>
        </div>
        <div style="width:100%;text-align:center">
         <el-button  @click="exit"  type="primary">退出</el-button>
        </div>
      </div>
</transition>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
    },
    data(){
        return {
        tableData: [{
            date: '465161685416',
            name: '3',
            address: '8'
          }, {
            date: '465161685416',
            name: '5',
            address: '4'
          }, {
            date: '465161685416',
            name: '3',
            address: '6'
          }],
          row:{
            id:"460020095040671966",
            dangerous:"85",
            adata:"测试文字"
        }
        }
    },
    computed: {
        tableWidth: function(){
            var pieWidth = getComputedStyle(document.getElementsByClassName("storeLoc")[0],false).width;
            return pieWidth;
        }
    },
    methods: {
      exit(){
        this.$emit("exit");
      }
    },
    props:{
        ids:{
            type:Boolean
        },
        show:{
            type:Boolean
        }
    }
}


</script>

<style lang="scss">
.tableBox {
    th {
        padding:0 !important;
        height: 30px;
    }
    td {
        padding:0 !important;
        height:30px;
    }
}
.el-table, .el-table__expanded-cell {
    background-color: transparent;
}

.el-table th, .el-table tr {
    background-color: transparent;
}
.el-table__body tr:hover > td{
    background-color:#8a8a8a !important;
    color:black !important;
}
#myProgress {
  width: 90%;
  background-color: #ddd;
  margin-top: 10px;
}

#myBar {
  height: 25px;
  background-color: #c98b19;
  text-align: center;
  line-height: 30px;
  color: white;
}
</style>