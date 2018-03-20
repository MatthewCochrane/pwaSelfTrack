<template>
  <div class="chart-container">
    <scatter-chart :chart-data="dataCollection" :options="options"></scatter-chart>
  </div>
</template>

<script>
  import ScatterChart from '@/components/elements/ScatterChart'

  export default {
    components: {
      ScatterChart
    },
    props: ['trackId'],
    name: 'track-graph',
    computed: {
      track () {
        return this.$store.getters.getTrackById(this.$route.params.id)
      },
      dataCollection () {
        let dataMin = this.$store.getters.customSortedTrackData(this.trackId, {sumPeriod: this.track.sumPeriod, sumType: 'min', sortBy: 'time-desc'})
        let dataMax = this.$store.getters.customSortedTrackData(this.trackId, {sumPeriod: this.track.sumPeriod, sumType: 'max', sortBy: 'time-desc'})
        let dataMean = this.$store.getters.customSortedTrackData(this.trackId, {sumPeriod: this.track.sumPeriod, sumType: 'mean', sortBy: 'time-desc'})

        return {
          datasets: [
            {
              label: 'Min',
              borderColor: '#f87979',
              data: this.$lodash.map(dataMin, od => ({x: od.time, y: od.data})),
              showLine: true,
              tension: 0,
              fill: false
            },
            {
              label: 'Max',
              borderColor: '#79f879',
              data: this.$lodash.map(dataMax, od => ({x: od.time, y: od.data})),
              showLine: true,
              tension: 0,
              fill: false
            },
            {
              label: 'Mean',
              borderColor: '#7979f8',
              data: this.$lodash.map(dataMean, od => ({x: od.time, y: od.data})),
              showLine: true,
              tension: 0,
              fill: false
            }
          ]
        }
      },
      options () {
        let chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'linear',
              time: {
                unit: 'day'
              }
            }],
            yAxes: [{
            }]
          }
        }

        if (this.track.type === 'number') {
          if (this.track.minValue) {
            this.$lodash.set(chartOptions, 'scales.yAxes[0].ticks.suggestedMin', this.track.minValue)
          }
          if (this.track.maxValue) {
            this.$lodash.set(chartOptions, 'scales.yAxes[0].ticks.suggestedMax', this.track.maxValue)
          }
        }
        return chartOptions
      }
    }
  }
</script>

<style scoped>
  .chart-container {
    position: relative;
    /*height: 40vh;*/
    width: 90vw;
    margin: 0 auto;
  }
</style>
