<template>
  <div>
    <span class="md-headline" v-if="track">{{track.name}}</span>
    <md-tabs md-alignment="centered" md-sync-route>
      <md-tab id="tab-list" md-icon="" md-label="List" :to="makeSubPath('list')"></md-tab>
      <md-tab id="tab-graph" md-label="Graph" :to="makeSubPath('graph')"></md-tab>
      <md-tab id="tab-stats" md-label="Stats" :to="makeSubPath('stats')"></md-tab>
      <md-tab id="tab-settings" md-label="Settings" :to="makeSubPath('settings')"></md-tab>
      <md-tab id="tab-add" md-label="Add" :to="makeSubPath('add')"></md-tab>
    </md-tabs>
    <router-view></router-view>
    <md-button class="md-fab md-fab-bottom-right" :to="'/track/' + $route.params.id + '/add'">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
  export default {
    name: 'track-main',
    computed: {
      track () {
        return this.$store.getters.getTrackById(this.$route.params.id)
      }
    },
    methods: {
      makeSubPath (subPage) {
        return '/track/' + this.$route.params.id + '/' + subPage
      }
    }
  }
</script>

<style scoped>

</style>
