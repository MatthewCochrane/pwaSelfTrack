import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Dash from '@/components/Dash'
import Track from '@/components/Track'
import TrackList from '@/components/Track/List'
import TrackGraph from '@/components/Track/Graph'
import TrackStats from '@/components/Track/Stats'
import TrackSettings from '@/components/Track/Settings'
import TrackAddData from '@/components/Track/Add'
import Login from '@/components/Login'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Dash',
      component: Dash,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/track/:id',
      name: 'Track',
      component: Track,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'list',
          component: TrackList
        },
        {
          path: 'graph',
          component: TrackGraph
        },
        {
          path: 'stats',
          component: TrackStats
        },
        {
          path: 'settings',
          component: TrackSettings
        },
        {
          path: 'add',
          component: TrackAddData
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('/')
  else next()
})

export default router
