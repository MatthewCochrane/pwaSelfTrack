<template>
  <div v-if="track != null">
    <md-button>{{summaryText}}</md-button>
    <md-button @click="showSortBy = true">{{'Sort by:' + sortText}}</md-button>
    <md-button @click="showViewOptions = true">View Options</md-button>
    <md-table>
      <md-table-row>
        <!--<md-table-head>ID</md-table-head>-->
        <md-table-head>Time</md-table-head>
        <md-table-head>Data</md-table-head>
        <!--<md-table-head>Gender</md-table-head>-->
        <!--<md-table-head>Job Title</md-table-head>-->
      </md-table-row>

      <md-table-row v-for="tdata in sortedTrackData" :key="tdata.id">
        <md-table-cell>{{formatTime(tdata.time)}}</md-table-cell>
        <md-table-cell>{{tdata.data}}</md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog
      :md-active.sync="showSortBy">
      <md-dialog-title>Sort By</md-dialog-title>
      <div class="dialog-body">
        <div class="md-subhead">Time</div>
        <md-radio v-model="track.sortBy" value="time-asc">Ascending</md-radio>
        <md-radio v-model="track.sortBy" value="time-desc">Descending <small>(most recent first)</small></md-radio>
        <div class="md-subhead">Data</div>
        <md-radio v-model="track.sortBy" value="data-asc">Ascending <small>(smallest first, a->z)</small></md-radio>
        <md-radio v-model="track.sortBy" value="data-desc">Descending <small>(largest first, z->z)</small></md-radio>
      </div>
    </md-dialog>

    <md-dialog
      :md-active.sync="showViewOptions">
      <md-dialog-title>Sort By</md-dialog-title>
      <div class="dialog-body">
        <div class="md-subhead">Time</div>
        <!--<md-radio @change="closeSortBy" v-model="sortBy" value="time-asc">Ascending <small>(most recent first)</small></md-radio>-->
        <!--<md-radio @change="closeSortBy" v-model="sortBy" value="time-desc">Descending</md-radio>-->
        <!--<div class="md-subhead">Data</div>-->
        <!--<md-radio @change="closeSortBy" v-model="sortBy" value="data-asc">Ascending <small>(smallest first)</small></md-radio>-->
        <!--<md-radio @change="closeSortBy" v-model="sortBy" value="data-desc">Descending</md-radio>-->
      </div>
    </md-dialog>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  // import moment from 'moment-timezone'
  import moment from 'moment'

  export default {
    name: 'list',
    data () {
      return {
        showSortBy: false,
        showViewOptions: false
      }
    },
    computed: {
      summaryText () {
        return 'Summary'
      },
      sortText () {
        let names = {
          'time': 'Time',
          'data': 'Data'
        }

        let sb = this.track.sortBy

        if (this.track.sortBy) {
          sb = this.track.sortBy
        }

        sb = sb.split('-')
        let retStr = names[sb[0]]

        retStr += ' ' + sb[1]

        return retStr
      },
      sortedTrackData () {
        let sb = this.sortBy
        if (this.track && this.track.sortBy) {
          sb = this.track.sortBy
        }
        sb = sb.split('-')

        return this.$lodash.orderBy(this.trackData[this.$route.params.id], [sb[0]], [sb[1]])
      },
      track () {
        return this.$store.getters.getTrackById(this.$route.params.id)
      },
      ...mapState({
        trackData: state => state.tracks.trackData
      })
    },
    methods: {
      formatTime (time) {
        return moment(time).calendar()
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('updateTrack', this.track)
    }
  }
</script>

<style scoped>
  .md-dialog .md-radio {
    display: flex;
  }

  .dialog-body {
    padding: 20px;
  }
</style>
