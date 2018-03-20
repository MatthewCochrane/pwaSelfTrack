<template>
  <div v-if="track">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100" style="margin-bottom: 150px">
        <md-card-header>
          <div class="md-title">Add Entry</div>
        </md-card-header>

        <md-card-content>

          <!-- Type: NUMBER -->
          <!-- Type: NUMBER -->
          <!-- Type: NUMBER -->
          <!-- Type: NUMBER -->
          <!-- Type: NUMBER -->
          <div v-if="track.type === 'number'">
            <md-field>
              <md-icon>restore_page</md-icon>
              <label>Value</label>
              <md-input v-model="data" type="number" :min="track.minValue"
                        :max="track.maxValue"
                        :step="track.step"></md-input>
            </md-field>
          </div>

          <!-- Type: MULTIPLE CHOICE -->
          <!-- Type: MULTIPLE CHOICE -->
          <!-- Type: MULTIPLE CHOICE -->
          <!-- Type: MULTIPLE CHOICE -->
          <!-- Type: MULTIPLE CHOICE -->
          <div v-if="track.type === 'multiple-choice'">
            <md-field>
              <label>Value</label>

              <md-select v-model="data" name="track-default" id="track-default" md-dense>
                <md-option v-for="choice in track.choices" :value="choice" :key="'val-' + choice">{{choice}}</md-option>
              </md-select>
            </md-field>
          </div>

          <!-- Type: YES / NO -->
          <!-- Type: YES / NO -->
          <!-- Type: YES / NO -->
          <!-- Type: YES / NO -->
          <!-- Type: YES / NO -->
          <div v-if="track.type === 'yes-no'">
            <label>Value</label>
            <div>
              <md-radio v-model="data" :value="true">Yes</md-radio>
              <md-radio v-model="data" :value="false">No</md-radio>
            </div>
          </div>


          <!-- ALL TYPES -->
          <!-- ALL TYPES -->
          <!-- ALL TYPES -->
          <!-- ALL TYPES -->
          <!-- ALL TYPES -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item">
              <label>Date</label>
              <md-datepicker v-model="date" ></md-datepicker>
            </div>
            <div class="md-layout-item">
              <label>Time</label>
              <br/>
              <div style="margin: 4px 0 24px; padding-top: 16px; display: flex; position: relative; font-family: inherit;">
                <md-icon style="margin: 4px 12px 4px 0px; position: relative;">access_time</md-icon>
                <vue-timepicker v-model="timeVal" format="hh:mm:ss A"></vue-timepicker>
              </div>
            </div>
          </div>

          <md-field>
            <md-icon>comment</md-icon>
            <label>Comment</label>
            <md-textarea v-model="comment" md-autogrow></md-textarea>
          </md-field>

          <md-card-actions>
            <md-button @click="saveEntry">Save</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import VueTimepicker from 'vue2-timepicker'

  export default {
    name: 'add',
    components: { VueTimepicker },
    data () {
      return {
        data: null,
        date: null,
        timeVal: {
          hh: '10',
          mm: '05',
          ss: '00',
          A: 'AM'
        },
        comment: ''
      }
    },
    computed: {
      track () {
        return this.$store.getters.getTrackById(this.$route.params.id)
      }
    },
    methods: {
      dateAndTimeToDate () {
        let retDate = this.date
        retDate.setHours(parseInt(this.timeVal.hh) + ((this.timeVal.A === 'PM') ? 12 : 0))
        retDate.setMinutes(parseInt(this.timeVal.mm))
        retDate.setSeconds(parseInt(this.timeVal.ss))
        return retDate
      },
      saveEntry () {
        this.$store.dispatch('addDataToTrack', {trackId: this.track.id,
          newData: {
            time: this.dateAndTimeToDate(),
            data: this.data,
            comment: this.comment
          }
        })
        this.$router.go(-1)
      }
    },
    beforeRouteEnter (to, from, next) {
      // TODO: wait for firestorm to sync!
      next(vm => {
        vm.date = new Date()
        vm.timeVal.hh = (new Date().getHours() % 12).toString()
        vm.timeVal.mm = new Date().getMinutes().toString()
        vm.timeVal.ss = new Date().getSeconds().toString()
        vm.timeVal.A = new Date().getHours() > 12 ? 'PM' : 'AM'
        if (vm.track && 'default' in vm.track) {
          vm.data = vm.track.default
        }
      })
    }
  }
</script>

<style scoped>

</style>
