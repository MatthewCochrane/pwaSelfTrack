import Vue from 'vue'
import firestore from '../firestore'
import _ from 'lodash'
import arrStat from '@/helpers/arr_stat'
import moment from 'moment-timezone'

export default {
  state: {
    tracks: {},
    trackData: {}
  },
  mutations: {
    updateTracks (state, tracks) {
      state.tracks = tracks
    },
    removeTrack (state, track) {
      if (track.id in state.trackData) {
        Vue.delete(state.trackData, track)
      }
      if (track.id in state.tracks) {
        Vue.delete(state.tracks, track)
      }
      // state.tracks.splice(state.tracks.indexOf(track), 1)
    },
    updateTrackData (state, payload) { // Updates locally only
      Vue.set(state.trackData, payload.trackId, payload.data)
    }
  },
  actions: {
    addTrack ({ commit }, data) {
      firestore.tracksColRef.add(data)
    },
    deleteTrack ({ commit }, trackId) {
      firestore.tracksColRef.doc(trackId).delete()
    },
    updateTrack ({ commit }, track) {
      let clone = Object.assign({}, track)
      delete clone['id']
      return firestore.tracksColRef.doc(track.id).set(clone)
    },
    addDataToTrack ({ commit }, { trackId, newData }) {
      return firestore.tracksColRef.doc(trackId).collection('data').add(newData)
    },
    updateDataInTrack ({ commit }, { trackId, data }) {
      let clone = Object.assign({}, data)
      delete clone['id']
      return firestore.tracksColRef.doc(trackId).collection('data').doc(data.id).update(clone)
    }
  },
  getters: {
    getTrackById: (state) => (id) => {
      return state.tracks[id]
    },
    customSortedTrackData: (state) => (id, options) => {
      let [sortColumn, sortOrder] = options.sortBy.split('-')

      let sumPeriod = _.get(options, 'sumPeriod', 'none')
      let sumType = _.get(options, 'sumType')
      if (sumPeriod !== 'none' && sumType) {
        let sortedData = _.orderBy(state.trackData[id], ['time'], ['desc'])
        let grouped = _.groupBy(sortedData, d => moment(d.time).startOf(sumPeriod).format())
        var sumFunc = arrStat[sumType]
        let unmapped = _.mapValues(grouped, day => sumFunc(_.map(day, d => parseFloat(d.data))))
        return _.map(unmapped, (val, key) => ({ time: key, data: val }))
      }

      return _.orderBy(state.trackData[id], [sortColumn], [sortOrder])
    },
    sortedTrackData: (state, getters) => (id) => {
      let track = state.tracks[id]
      if (!track.sortBy) track.sortBy = 'time-desc'

      return getters.customSortedTrackData(id, track)
    }
  }
}
