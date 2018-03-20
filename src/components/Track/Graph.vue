<template>
  <div v-if="track">
    <md-button @click="showSummaryOptions = true">{{summaryText}}</md-button>

    <track-graph :trackId="track.id"></track-graph>


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
      </div>
      <md-dialog-actions>
        <md-button @click="showSummaryOptions = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TrackGraph from '@/components/elements/TrackGraph'
  import moment from 'moment-timezone'
  // import moment from 'moment'

  export default {
    name: 'list',
    components: {
      'track-graph': TrackGraph
    },
    data () {
      return {
        showSummaryOptions: false
      }
    },
    computed: {
      summaryText () {
        return this.track.sumPeriod
      },
      sortText () {
        return this.track.sortBy.split('-').join(' ')
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
