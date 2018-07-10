// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import './permission'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/base.scss";
import './assets/iconfont/iconfont.css';
import store from './store'
import qs from 'qs'
import md5 from 'js-md5'

// Vue.use(ElementUI)
Vue.use(ElementUI, {
  size: 'small' // set element-ui default size
})

Vue.prototype.$ajax = axios
axios.defaults.withCredentials = true
Vue.prototype.$store = store
Vue.prototype.$qs = qs
Vue.prototype.$md5 = md5


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
