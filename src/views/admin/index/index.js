import Vue from 'vue';
import init from 'assets/js/init.js'
import china from './china.js'

Vue.use(init);
import App from './app.vue';

new Vue({
  china,
  render: h => h(App)
}).$mount('#app')
