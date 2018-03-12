<template>
  <div id="hello">
    <button @click="moveTo(0)">最底部</button>
    <button @click="moveTo(1)">最顶部</button>
    <button @click="moveTo(2)">最左部</button>
    <button @click="moveTo(3)">最右部</button>

    <div class="moveDemo">
      <touch ref="touch" :commonSlideTransition="true">
        <div class="touch" ref="touch">
          <i style="font-size: 13px">touchtouchtouchtouchtouchtouchtoucht1232112312312312321E1111111111111111111111111</i>
          <p>touchtouchtouchtouchtouchtouchtoucht123211231231</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>touchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
          <p>1ENDtouchtouchtouchtouchtouchtouchtoucht1232112312312312321E</p>
        </div>
      </touch>
    </div>
  </div>
</template>

<script>
  import {getOffset} from "./utils";
  import Touch from './touch/touch'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },

    mounted() {
    },

    components: {
      Touch
    },

    methods: {
      moveTo(type) {
        const el = this.$refs.touch;
        if(type === 0) el.moveYToEnd();
        if(type === 1) el.moveYToStart();
        if(type === 2) el.moveXToStart();
        if(type === 3) el.moveXToEnd();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #hello {
    /*padding-top: 50px;*/
    /*padding: 50px;*/
  }

  .touch {
    display: inline-block;
    /*width: 500px;*/
    /*height: 500px;*/
    background: #000;
    font-size: 0;
    color: antiquewhite;
  }

  p{
    display: inline-block;
    font-size: 13px;
  }

  .moveDemo {
    /*padding: 0 50px;*/
    width: 100px;
    height: 100px;
    overflow: hidden;
  }
</style>
