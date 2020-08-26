<template>
<transition name="el-fade-in-linear">
      <div v-show="show"  v-bind:id="ids" class="medicalInfo confrontBox" >
    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      class="tableBox"
      width="tableWidth"
       :header-cell-style="th_style"
       :row-style="{background:'#1d1d1d',color:'#FFFFFF'}"
      >
      <el-table-column align="center" label="传染源信息">
        
      <el-table-column
        prop="date"
        label="ID"
        style="font-size: 10px;"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        width="70"
        label="驻点数">
      </el-table-column>
      <el-table-column
        prop="address"
        width="70"
        label="接触数"
        >
      </el-table-column>
      </el-table-column>
    </el-table>

    <el-table
    v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="addressData"
      class="tableBox"
      width="tableWidth"
       :header-cell-style="th_style"
       :row-style="{background:'#1d1d1d',color:'#FFFFFF'}"
      >
      <el-table-column align="center" label="传染源所到驻点">
      <el-table-column
        prop="address"
        label="地址"
        style="font-size: 10px;"
        >
      </el-table-column>
      
      <el-table-column
        width="70"
        label="查看"
        >
        <template slot-scope="scope">
        <el-button type="text" @click="checkDetail(scope.$index)">跳转</el-button>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="specular"
      class="tableBox"
      width="tableWidth"
       :header-cell-style="th_style"
       :row-style="{background:'#1d1d1d',color:'#FFFFFF'}"
      >
      <el-table-column align="center" label="可疑接触者">
      <el-table-column
        prop="id"
        label="ID"
        style="font-size: 10px;"
        >
      </el-table-column>
      <el-table-column
        prop="dangerous"
        label="危险系数"
        style="font-size: 10px;"
        width="60"
        >
      </el-table-column>
      <el-table-column
        width="70"
        label="查看"
        >
        <template slot-scope="scope">
        <el-button type="text" @click="clickLine(scope.row,scope.$index)">跳转</el-button>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>
      </div>
</transition>
</template>

<script>
import echarts from 'echarts';
import * as d3 from 'd3';
export default {
    mounted(){
      // var timer = setTimeout(function(){
      //   console.log("okk?")
      //   this.loading=false;
      // }, 1000);
      //clearTimeout(timer);
    },
    data(){
        return {
        tableData: [{
            index:"1",
            date: '460000095005565778',
            name: '3',
            address: '3'
          }],
          th_style:{
                "border-bottom-color": "#606266",
                background:'#f1f1f1',color:'#606266'
          },
        addressData:[{
          address:"沈阳市铁西区保工家苑"
        },{
          address:"沈阳市沈河区文萃路茂业百货"
        },{
          address:"沈阳市浑南区南堤中路篮球场"
        }],
        specular:[{
          id:"460020095040671966",
          dangerous:"85",
          adata:"疑似与传染源同乘公共交通"
        },{
          id:"460000095063881983",
          dangerous:"67",
          adata:"与传染源同时段处于同一驻点"
        },{
          id:"460000095093417729",
          dangerous:"62",
          adata:"与传染源同时段处于同一驻点"
        }],
        loading:false,
        }
    },
    computed: {
        tableWidth: function(){
            var pieWidth = getComputedStyle(document.getElementsByClassName("storeLoc")[0],false).width;
            return pieWidth;
        }
    },
    methods: {
      checkDetail(data){
        this.$emit('circleHigh',data);
      },
      clickLine(row,index){
        this.$emit("lineHigh",row,index);
      }
    },
    props:{
        ids:{
            type:String
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
        text-align: center;
    }
    td {
        padding:0 !important;
        height:30px;
        text-align: center;
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
.el-button--text {
  color: #fff;
}
</style>