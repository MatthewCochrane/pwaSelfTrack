<template>
  <div v-if="track != null">
    <md-button @click="showSummaryOptions = true">{{summaryText}}</md-button>
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
        <div class="md-subhead">Time Format</div>
        <md-radio v-model="track.timeFormat" value="calendar">Calendar <small>Last Thursday at 2:10 PM</small></md-radio>
        <md-radio v-model="track.timeFormat" value="standard">Standard <small>20/03/2018 22:15</small></md-radio>
      </div>
    </md-dialog>

    <md-dialog
      :md-active.sync="showSummaryOptions">
      <md-dialog-title>Summarise By</md-dialog-title>
      <div class="dialog-body">
        <div class="md-subhead">Period</div>
        <md-radio v-model="track.sumPeriod" value="none">None</md-radio>
        <md-radio v-model="track.sumPeriod" value="hour">Hour</md-radio>
        <md-radio v-model="track.sumPeriod" value="day">Day</md-radio>
        <md-radio v-model="track.sumPeriod" value="week">Week</md-radio>
        <md-radio v-model="track.sumPeriod" value="month">Month</md-radio>
        <md-radio v-model="track.sumPeriod" value="year">Year</md-radio>
        <div class="md-subhead">Type</div>
        <md-radio v-model="track.sumType" value="cnt">Count</md-radio>
        <md-radio v-model="track.sumType" value="min">Min</md-radio>
        <md-radio v-model="track.sumType" value="max">Max</md-radio>
        <md-radio v-model="track.sumType" value="mean">Mean</md-radio>
        <md-radio v-model="track.sumType" value="median">Median</md-radio>
        <md-radio v-model="track.sumType" value="variance">Variance</md-radio>
        <md-radio v-model="track.sumType" value="standardDeviation">Standard Deviation</md-radio>
        <md-radio v-model="track.sumType" value="sum">Sum</md-radio>
      </div>
      <md-dialog-actions>
        <md-button @click="showSummaryOptions = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment-timezone'
  // import moment from 'moment'

  export default {
    name: 'list',
    data () {
      return {
        showSortBy: false,
        showViewOptions: false,
        showSummaryOptions: false
      }
    },
    computed: {
      summaryText () {
        return this.track.sumPeriod + ((this.track.sumPeriod !== 'none') ? ' ' + this.track.sumType : '')
      },
      sortText () {
        return (this.track.sumPeriod === 'none') ? this.track.sortBy.split('-').join(' ') : 'TIME DESC'
      },
      sortedTrackData () {
        return this.$store.getters.sortedTrackData(this.$route.params.id)
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
        if (this.track.timeFormat && this.track.timeFormat === 'calendar') {
          return moment(time).calendar()
        } else {
          return moment(time).format()
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('updateTrack', this.track)
      next()
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
