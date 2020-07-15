<template>
  <div v-bind:style="{left : left}" class="floatToolBar toolBox">
    <p class="boxtext boxtitle">出行分析工具</p>
    <div class="boxitem">
      <div style="width:100%">
        <p class="boxtext boxsubtitle">日期:</p>
        <p class="boxtext boxsubtitle" style="width:200px">2018/10/03</p>
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
            <div class="O-1-swatch" style="background:#1b669a;"></div>
            <div class="boxtext O-1-label" title="Wholesale and Retail Trade">驾车</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#33a02c;"></div>
            <div class="boxtext O-1-label" title="Manufacturing">步行</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#a1c97c;"></div>
            <div class="boxtext O-1-label" title="Leisure and hospitality">骑行</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#e31a1c;"></div>
            <div class="boxtext O-1-label" title="Business services">公交</div>
          </div>
          <div class="O-1-item">
            <div class="O-1-swatch" style="background:#fb9a99;"></div>
            <div class="boxtext O-1-label" title="Construction">地铁</div>
          </div>
        </div>
      </div>
    </div>
    <div class="boxitem">
          <div style="width:100%; align-items:center;display:flex;">
            <p class="boxtext boxsubtitle">出行迁移</p>
            <img  v-on:click="reactTime" class="boxtext boxsubtitle rangeButton retagleButton" src="./img/timelapses.png"  />
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