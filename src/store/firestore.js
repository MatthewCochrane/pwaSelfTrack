import firebase from 'firebase'
import store from './store'
import 'firebase/firestore'
// require('firebase/firestore')

const config = {
  apiKey: 'AIzaSyBAJhutaQqFF9ZLGlXITAgELnrv2bX9nXI',
  authDomain: 'fb-test-1-a17a2.firebaseapp.com',
  databaseURL: 'https://fb-test-1-a17a2.firebaseio.com',
  projectId: 'fb-test-1-a17a2',
  storageBucket: 'fb-test-1-a17a2.appspot.com',
  messagingSenderId: '568028726365'
}

firebase.initializeApp(config)

var refs = {
  db: null,
  tracksColRef: null,
  isReady: {
    'tracks': false,
    'track': {}
  }
}

let cancelTracksWatch = null
let cancelTrackWatchers = {}

function allWatchersReady () {
  for (var key in refs.isReady.track) {
    if (refs.isReady.track.hasOwnProperty(key)) { // Check that the key is defined in the object itself, not in parent
      if (!refs.isReady.track[key]) return false
    }
  }
  return true
}

function updateReadyInStore () {
  let curVal = refs.isReady.tracks && allWatchersReady()
  if (store.state.auth.firestoreReady !== curVal) {
    store.commit('setFirestoreReady', curVal)
  }
}

firebase.firestore().enablePersistence()
  .then(() => {
    // Initialise Cloud Firestore through firebase
    refs.db = firebase.firestore()
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        if (cancelTracksWatch) cancelTracksWatch()
        return
      }

      const userDocRef = refs.db.collection('users').doc(user.uid)

      userDocRef.get().then(doc => {
        if (!doc.exists) {
          // Doc does not exist.  Create it!
          return userDocRef.set({
            displayName: user.displayName,
            email: user.email,
            settings: {test: false}
          })
        }
      }).then(() => {
        refs.tracksColRef = userDocRef.collection('tracks')

        cancelTracksWatch = refs.tracksColRef.onSnapshot(trackQuerySnapshot => {
          const myTracks = {}
          refs.isReady.tracks = false
          trackQuerySnapshot.forEach(doc => {
            myTracks[doc.id] = {id: doc.id, ...doc.data()}
          })
          store.commit('updateTracks', myTracks)

          trackQuerySnapshot.docChanges.forEach(documentChange => {
            if (documentChange.type === 'added') {
              refs.isReady.track[documentChange.doc.id] = false // Watch this doc for isReady
              cancelTrackWatchers[documentChange.doc.id] = refs.tracksColRef
                .doc(documentChange.doc.id).collection('data').onSnapshot(dataQuerySnapshot => {
                  const dataInTrack = []
                  dataQuerySnapshot.forEach(doc => {
                    dataInTrack.push({id: doc.id, ...doc.data()})
                  })
                  store.commit('updateTrackData', {trackId: documentChange.doc.id,
                    data: dataInTrack})

                  if (!refs.isReady.track[documentChange.doc.id]) {
                    refs.isReady.track[documentChange.doc.id] = true
                    updateReadyInStore()
                  }
                })
            } else if (documentChange.type === 'removed') {
              if (documentChange.doc.id in cancelTrackWatchers) {
                cancelTrackWatchers[documentChange.doc.id]()
                delete cancelTrackWatchers[documentChange.doc.id]
              }
              if (documentChange.doc.id in refs.isReady.track) {
                // Don't care about this doc being ready or not..
                // It no longer exists.
                delete refs.isReady.track[documentChange.doc.id]
                updateReadyInStore()
              }
            }
          })

          if (!refs.isReady.tracks) {
            refs.isReady.tracks = true
            updateReadyInStore()
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    })
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time
      alert('Multiple tabs open, persistence can only be enabled in one tab at a time')
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      alert('The current browser does not support all of the features required to enable persistence')
    }
  })

export default refs

// export default {
//   fetchTracks: () => {
//     return refs.tracksColRef.get()
//   },
//   addTrack: data => {
//     return refs.tracksColRef.add(data)
//   },
//   removeTrack: id => {
//     // This will leave the tracks orphaned.  This is fine for now but we probably want to
//     // delete the data too...
//     return refs.tracksColRef.doc(id).delete()
//   },
//   updateTrack: data => {
//     let clone = Object.assign({}, data)
//     delete clone['id']
//     return refs.tracksColRef.doc(data.id).set(clone)
//   },
//   addDataToTrack: (trackId, newData) => {
//     return refs.tracksColRef.doc(trackId).collection('data').add(newData)
//   },
//   updateDataInTrack: (trackId, data) => {
//     let clone = Object.assign({}, data)
//     delete clone['id']
//     return refs.tracksColRef.doc(trackId).collection('data').doc(data.id).update(clone)
//   }
// }
