<template>
  <div v-bind:style="{left : left}" class="floatToolBar toolBox">
    <p class="boxtext boxtitle">出行分析工具</p>
    <div class="boxitem">
      <div style="width:100%">
        <p class="boxtext boxsubtitle">日期:</p>
        <p class="boxtext boxsubtitle" style="width:200px">2020/2/17</p>
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
      <p class="boxtext boxsubtitle">图例:</p>
      <div
        style="display: flex; align-items: center; margin-left: 40px; min-height: 33px; font: 10px sans-serif;"
      >
        <div style="width: 100%; columns: 180px;">
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#4c5d91;"></div>
            <div class="O-1-label" title="Wholesale and Retail Trade">驾车</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#4c92b9;"></div>
            <div class="O-1-label" title="Manufacturing">步行</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#53a488;"></div>
            <div class="O-1-label" title="Leisure and hospitality">骑行</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#a5ad5c;"></div>
            <div class="O-1-label" title="Business services">公交</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#909399;"></div>
            <div class="O-1-label" title="Construction">地铁</div>
          </div>
        </div>
      </div>
    </div>
    <div class="boxitem" style="padding-bottom: 30px;">
      <div style="width:100%; align-items:center;display:flex;">
        <p class="boxtext boxsubtitle">图表分析</p>
        <img
          id="pathButton"
          v-on:click="showdiagram"
          class="boxtext boxsubtitle rangeButton"
          src="./img/pathdiagram.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      minicolor: "blue", //图例三种颜色
      midiumcolor: "rgb(0, 255, 0)",
      maxcolor: "red",
      mininumber: "0", //图例三种数字
      midiumnumber: "0",
      maxnumber: "0"
    };
  },
  methods: {
    showdiagram() {
      this.$emit("showdiagram", "path");
    }
  },
  props: {
    left: {
      type: String
    }
  }
};
</script>