<template>
  <div>
    <!--<div class="md-layout md-gutter md-alignment-center">-->
      <!--<div class="md-layout-item md-size-40">-->

        <md-empty-state
          v-if="$lodash.isEmpty(tracks)"
          md-icon="all_inclusive"
          md-label="Create your first track"
          md-description="Your tracks will appear here once you create some">
          <md-button class="md-primary md-raised" @click="showAddTrackDialog = true">Create first track</md-button>
        </md-empty-state>

        <div v-if="!$lodash.isEmpty(tracks)">
          <md-card class="track-card md-primary" :md-theme="track.colour + '-card'"
                   v-for="track in tracks"
                   v-bind:key="track.id" md-with-hover>
            <md-ripple @click.native="$router.push('/track/' + track.id + '/list')">
              <md-card-header>
                <h4 class="md-title" style="flex: 1">
                  <md-icon>{{getTrackIconType(track)}}</md-icon>
                  <!--<span><small>{{track.name}}</small></span></h4>-->
                  <span>{{track.name}}</span></h4>
              </md-card-header>
              <md-card-content>
                <!--TODO: put content here-->
              </md-card-content>

              <md-card-actions>
                <md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/list')">
                  <md-icon>
                    visibility
                  </md-icon>
                </md-button>
                <md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/settings')">
                  <md-icon>
                    settings
                  </md-icon>
                </md-button>
                <md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/add')">
                  <md-icon>
                    add
                  </md-icon>
                </md-button>
                <!--<md-button class="md-icon-button" :to="'/track/' + track.id + '/list'">-->
                  <!--<md-icon>-->
                    <!--keyboard_voice-->
                  <!--</md-icon>-->
                <!--</md-button>-->
              </md-card-actions>
            </md-ripple>
          </md-card>

          <md-button class="md-fab md-fab-bottom-right" @click="showAddTrackDialog = true">
            <!--<md-icon>note_add</md-icon>-->
            <md-icon>add</md-icon>
          </md-button>
        </div>

        <md-dialog :md-click-outside-to-close="false"
                   :md-fullscreen="false" :md-active.sync="showAddTrackDialog"
                   @md-cancel="closeAddTrackDialog">
          <md-dialog-title>Create A New Track</md-dialog-title>
          <div class="dialog-padding">
            <md-field>
              <label>Track Name</label>
              <md-input v-model="newTrackName"></md-input>
              <!--<span class="md-helper-text">Helper text</span>-->
            </md-field>

            <md-field>
              <label for="newTrackType">Track Type</label>
              <md-select v-model="newTrackType" name="newTrackType" id="newTrackType">
                <md-option value="number">Number</md-option>
                <md-option value="text">Text</md-option>
                <md-option value="yes-no">Yes / No</md-option>
                <md-option value="multiple-choice">Multiple Choice</md-option>
                <md-option value="duration">Duration</md-option>
                <md-option value="point-in-time">Point In Time</md-option>
                <md-option value="custom">Custom</md-option>
              </md-select>
              <span class="md-helper-text" @click="showTrackTypeHelp = true">Help</span>
            </md-field>

            <md-dialog-actions>
              <md-button class="md-primary" @click="closeAddTrackDialog">Cancel</md-button>
              <md-button class="md-primary" @click="addTrackFromDialog">Add</md-button>
            </md-dialog-actions>
          </div>
        </md-dialog>

        <md-dialog :md-click-outside-to-close="false" :md-backdrop="false" :md-fullscreen="false" :md-active.sync="showTrackTypeHelp">
          <md-dialog-title>Track Type Help...</md-dialog-title>
          <md-dialog-content class="dialog-padding">
            <div class="md-title">
              Number
            </div>
            <div class="md-body-1">
              Tracks numeric values, positive or negative.  Can be restricted to a range.
              Can also be restricted to integers.
            </div>
            <div class="md-title">
              Text
            </div>
            <div class="md-body-1">
              Tracks any unrestricted text input.
            </div>
            <div class="md-title">
              Yes / No
            </div>
            <div class="md-body-1">
              Tracks a a binary value (ie yes or no). eg. Did you go for a run today?
            </div>
            <div class="md-title">
              Multiple Choice
            </div>
            <div class="md-body-1">
              Allows a selection from a user-defined list.  eg. specify your mood from a
              list: good, average, bad.
            </div>
            <div class="md-title">
              Duration
            </div>
            <div class="md-body-1">
              Specify a length of time.  It starts at a specific moment and lasts some specific
              duration.  eg. 45 minute workout starting at 5:25pm
            </div>
          </md-dialog-content>
          <md-dialog-actions>
            <md-button class="md-primary" @click="showTrackTypeHelp = false">Close</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
    <!--</div>-->
  <!--</div>-->
</template>

<script>
  import { mapState } from 'vuex'
  import trackHelper from '@/helpers/tracks'

  export default {
    name: 'dash',
    data () {
      return {
        showAddTrackDialog: false,
        showTrackTypeHelp: false,
        newTrackName: '',
        newTrackType: ''
      }
    },
    computed: mapState({
      tracks: state => state.tracks.tracks
    }),
    methods: {
      // ...mapActions(['addTrack']),
      closeAddTrackDialog () {
        // Reset fields and close dialog
        this.newTrackName = ''
        this.newTrackType = ''
        this.showAddTrackDialog = false
      },
      addTrackFromDialog () {
        this.$store.dispatch('addTrack', {
          name: this.newTrackName,
          type: this.newTrackType,
          colour: 'white',
          sortBy: 'time-desc',
          timeFormat: 'calendar'
        })
        this.closeAddTrackDialog()
      },
      editTrack (track) {
        // console.log(track)
        this.$router.push('/track/' + track.id)
      },
      getTrackIconType (track) {
        return trackHelper.getIconCode(track.type)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~vue-material/dist/theme/engine";

  .dialog-padding {
    padding-left: 20px;
    padding-right: 20px;
  }

  .track-card {
    width: 250px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

  @include md-register-theme("red-card", (
    primary: md-get-palette-color(red, 500)
  ));

  @include md-register-theme("pink-card", (
    primary: md-get-palette-color(pink, 500)
  ));

  @include md-register-theme("purple-card", (
    primary: md-get-palette-color(purple, 500)
  ));

  @include md-register-theme("deeppurple-card", (
    primary: md-get-palette-color(deeppurple, 500)
  ));

  @include md-register-theme("indigo-card", (
    primary: md-get-palette-color(indigo, 500)
  ));

  @include md-register-theme("blue-card", (
    primary: md-get-palette-color(blue, 500)
  ));

  @include md-register-theme("lightblue-card", (
    primary: md-get-palette-color(lightblue, 500)
  ));

  @include md-register-theme("cyan-card", (
    primary: md-get-palette-color(cyan, 500)
  ));

  @include md-register-theme("teal-card", (
    primary: md-get-palette-color(teal, 500)
  ));

  @include md-register-theme("green-card", (
    primary: md-get-palette-color(green, 500)
  ));

  @include md-register-theme("lightgreen-card", (
    primary: md-get-palette-color(lightgreen, 500)
  ));

  @include md-register-theme("lime-card", (
    primary: md-get-palette-color(lime, 500)
  ));

  @include md-register-theme("yellow-card", (
    primary: md-get-palette-color(yellow, 500)
  ));

  @include md-register-theme("amber-card", (
    primary: md-get-palette-color(amber, 500)
  ));

  @include md-register-theme("orange-card", (
    primary: md-get-palette-color(orange, 500)
  ));

  @include md-register-theme("brown-card", (
    primary: md-get-palette-color(brown, 500)
  ));

  @include md-register-theme("grey-card", (
    primary: md-get-palette-color(grey, 500)
  ));

  @include md-register-theme("white-card", (
    primary: md-get-palette-color(white, 500)
  ));

  @include md-register-theme("black-card", (
    primary: md-get-palette-color(black, 500)
  ));

  @import "~vue-material/dist/base/theme";
  @import "~vue-material/dist/components/MdCard/theme";

</style>
