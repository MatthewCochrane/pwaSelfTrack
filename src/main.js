// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import App from './App'
import router from './router'
import store from './store/store'
import './store/firestore'
import firebase from 'firebase'
import VueTimepicker from 'vue2-timepicker'
import lodash from 'lodash'
import arrStat from './helpers/arr_stat'

let moment = require('moment-timezone')

window.moment = moment
window._ = lodash
window.arrStat = arrStat

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })

let app

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(VueTimepicker)

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  }
  store.commit('setCurrentUser', firebase.auth().currentUser)
})
