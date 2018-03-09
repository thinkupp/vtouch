<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  ul, li {
    list-style: none;
  }

  body, html, #app {
    height: 100%;
    overflow: hidden;
  }
</style>
