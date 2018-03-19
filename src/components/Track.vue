<template>
  <div>
    <span class="md-headline" v-if="track">{{track.name}}</span>
    <md-tabs md-sync-route>
      <md-tab id="tab-list" md-label="List" :to="'/track/' + $route.params.id + '/list'"></md-tab>
      <md-tab id="tab-stats" md-label="Stats" :to="'/track/' + $route.params.id + '/stats'"></md-tab>
      <md-tab id="tab-settings" md-label="Settings" :to="'/track/' + $route.params.id + '/settings'"></md-tab>
      <md-tab id="tab-add" md-label="Add" :to="'/track/' + $route.params.id + '/add'"></md-tab>
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
    }
  }
</script>

<style scoped>

</style>
