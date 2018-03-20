import Vue from 'vue'
import App from './App.vue'
import uppTouch from 'upp-touch'

Vue.use(uppTouch);


new Vue({
  el: '#app',
  render: h => h(App)
})
