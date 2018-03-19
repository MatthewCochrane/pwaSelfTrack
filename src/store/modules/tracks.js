import Vue from 'vue'
import firestore from '../firestore'

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
      return firestore.tracksColRec.doc(trackId).collection('data').add(newData)
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
      // return state.tracks.find(track => track.id === id)
    },
    sortedTrackData: (state) => (id, options) => {

    }
  }
}
