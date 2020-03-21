<template>
  <quick-menu :menu-count="count" 
        :icon-class="icons" 
        :menu-url-list="list">
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
        count:3,
        icons:["fa fa-github","fa fa-comment",
               "fa fa-code"],
        list:["http://jd.com",
            "http://jd.com",
            "http://jd.com"],
        backgroundColor:'#42A5F5',
        color:'#eee',
        position:'top-right',
        isOpenNewTab:false
      }
  }
}    
</script>