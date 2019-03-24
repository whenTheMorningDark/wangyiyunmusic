// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import fastClick from 'fastclick'
import VueLazyLoad from "vue-lazyload"
Vue.config.productionTip = false
fastClick.attach(document.body)
Vue.use(VueLazyLoad,{
  loading:require("common/image/default.png")
})
import 'common/stylus/index.styl'
import './style.css'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
