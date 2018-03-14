<template>
    <div class="button" @click="clickBtn">{{str}}</div>
</template>

<script>
    export default {
      props: {
        str: {
          type: String,
          default: ''
        }
      },

      methods: {
        clickBtn() {
          this.$emit('click')
        }
      }
    }
</script>

<style scoped>
  .button {
    width: 19%;
    height: 30px;
    line-height: 30px;
    background: #8dbfff;
    border-radius: 5px;
    outline: none;
    text-align: center;
    display: inline-block;
    color: #FFF;

  }
</style>
