<template>
      <div v-bind:id="ids" class="storeLoc" >
    <el-table
      :data="tableData"
      class="tableBox"
      width="tableWidth">
      <el-table-column
        prop="date"
        width="100"
        label="传染源ID"
        style="font-size: 10px;"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        width="50"
        label="驻点数">
      </el-table-column>
      <el-table-column
        prop="address"
        width="50"
        label="接触数"
        >
      </el-table-column>
    </el-table>
      </div>
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
          }]
        }
    },
    computed: {
        tableWidth: function(){
            var pieWidth = getComputedStyle(document.getElementsByClassName("storeLoc")[0],false).width;
            return pieWidth;
        }
    },
    methods: {
      
    },
    props:{
        ids:{
            type:String
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
</style>