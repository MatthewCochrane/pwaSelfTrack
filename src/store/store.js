import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import tracks from './modules/tracks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    tracks
  }
})
