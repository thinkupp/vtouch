<template>
  <div id="hello">
    <touch>
      <div class="touch" ref="touch">
        touchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouchtouch
      </div>
    </touch>
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
      console.log(getOffset(this.$refs.touch));
    },

    components: {
      Touch
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #hello {
    /*padding-top: 50px;*/
  }

  .touch {
    width: 500px;
    overflow: hidden;
    height: 50px;
    background: #000;
    color: antiquewhite;
  }
</style>
