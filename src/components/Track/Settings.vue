<template>
  <div v-if="track">
    <div class="full-control">
      <md-list>

        <md-subheader>Track</md-subheader>

        <md-list-item>
          <md-icon>fingerprint</md-icon>
          <md-field>
            <label>Name</label>
            <md-input v-model="track.name"></md-input>
          </md-field>
        </md-list-item>

        <md-list-item>
          <md-icon>text_fields</md-icon>
          <md-field>
            <label for="track-type">Type</label>
            <md-select v-model="track.type" name="track-type" id="track-type" md-dense disabled>
              <md-option value="number">Number</md-option>
              <md-option value="text">Text</md-option>
              <md-option value="yes-no">Yes / No</md-option>
              <md-option value="multiple-choice">Multiple Choice</md-option>
              <md-option value="duration">Duration</md-option>
              <md-option value="point-in-time">Point In Time</md-option>
              <md-option value="custom">Custom</md-option>
            </md-select>
          </md-field>
        </md-list-item>

        <md-list-item>
          <md-icon>color_lens</md-icon>
          <md-button class="md-icon-button md-list-action" @click="showColourPickDialog = true">
            <md-icon :class="'is-color-' + track.colour">brightness_1</md-icon>
          </md-button>
          <span style="width: 50px"></span>
        </md-list-item>

        <!-- Type: TEXT -->
        <!-- Type: TEXT -->
        <!-- Type: TEXT -->
        <!-- Type: TEXT -->
        <!-- Type: TEXT -->
        <div v-if="track.type === 'text'">
          <md-list-item>
            <md-icon>details</md-icon>
            <md-field>
              <label>Default</label>
              <md-input v-model="track.default"></md-input>
              <span class="md-helper-text">Help</span>
            </md-field>
          </md-list-item>
        </div>

        <!-- Type: NUMBER -->
        <!-- Type: NUMBER -->
        <!-- Type: NUMBER -->
        <!-- Type: NUMBER -->
        <!-- Type: NUMBER -->
        <div v-else-if="track.type === 'number'">
          <md-divider></md-divider>
          <md-subheader>Number</md-subheader>

          <md-list-item>
            <md-icon>vertical_align_bottom</md-icon>
            <md-field>
              <label>Minimum Value</label>
              <md-input v-model="track.minValue" type="number"></md-input>
            </md-field>
          </md-list-item>

          <md-list-item>
            <md-icon>vertical_align_top</md-icon>
            <md-field>
              <label>Maximum Value</label>
              <md-input v-model="track.maxValue" type="number"></md-input>
            </md-field>
          </md-list-item>

          <md-list-item>
            <md-icon>change_history</md-icon>
            <md-field>
              <label>Step</label>
              <md-input v-model="track.step" type="number"></md-input>
            </md-field>
          </md-list-item>

          <md-divider></md-divider>
          <md-subheader>Other</md-subheader>

          <md-list-item>
            <md-icon>restore_page</md-icon>
            <md-field>
              <label>Default</label>
              <md-input v-model="track.default" type="number" :min="track.minValue"
                        :max="track.maxValue"
                        :step="track.step"></md-input>
              <span class="md-helper-text">Help</span>
            </md-field>
          </md-list-item>
        </div>

        <!-- Type: MULTIPLE CHOICE -->
        <!-- Type: MULTIPLE CHOICE -->
        <!-- Type: MULTIPLE CHOICE -->
        <!-- Type: MULTIPLE CHOICE -->
        <!-- Type: MULTIPLE CHOICE -->
        <div v-else-if="track.type === 'multiple-choice'">

          <md-divider></md-divider>
          <md-subheader>Choice Values</md-subheader>

            <md-empty-state
              v-if="track.choices == null || track.choices.length === 0"
              md-icon="more_horiz"
              md-label="No Choices Added"
              md-description="Click the button below to add a choice"></md-empty-state>

          <md-list-item v-for="choice in track.choices" :key="'choice-' + choice">
            <span class="md-list-item-text">{{choice}}</span>
            <md-button class="md-icon-button md-list-action" @click="deleteChoice(choice)">
              <md-icon>delete</md-icon>
            </md-button>
          </md-list-item>
          <md-list-item @click="showAddChoicePrompt = true">
            Add Choice
          </md-list-item>

          <md-divider></md-divider>
          <md-subheader>Other</md-subheader>

          <md-list-item>
            <md-icon>favorite</md-icon>
            <md-field>
              <label>Default</label>

              <md-select v-model="track.default" name="track-default" id="track-default" md-dense>
                <md-option v-for="choice in track.choices" :value="choice" :key="'default-' + choice">{{choice}}</md-option>
                <md-option value="">None</md-option>
              </md-select>
            </md-field>
          </md-list-item>
        </div>

        <!-- Type: YES / NO -->
        <!-- Type: YES / NO -->
        <!-- Type: YES / NO -->
        <!-- Type: YES / NO -->
        <!-- Type: YES / NO -->
        <div v-if="track.type === 'yes-no'">
          <md-divider></md-divider>
          <md-subheader>Default Value</md-subheader>

          <md-list-item>
            <md-radio v-model="track.default" :value="true" />
            <span class="md-list-item-text">Yes</span>
          </md-list-item>

          <md-list-item>
            <md-radio v-model="track.default" :value="false" />
            <span class="md-list-item-text">No</span>
          </md-list-item>
        </div>

        <md-list-item @click="saveSettings">
          Save
        </md-list-item>
      </md-list>
    </div>

    <md-dialog-prompt
      :md-active.sync="showAddChoicePrompt"
      v-model="addChoiceValue"
      md-title="Add A New Choice"
      md-input-maxlength="30"
      md-input-placeholder="Type value here..."
      md-confirm-text="Add"
      @md-cancel="closeAddChoicePrompt"
      @md-confirm="confirmAddChoicePrompt"
      ref="addChoicePromptRef"/>

    <md-dialog class="color-dialog" :md-active.sync="showColourPickDialog">
      <md-dialog-title>Choose Track Colour</md-dialog-title>

      <div class="md-layout md-alignment-center">
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('red')">
            <md-icon class="is-color-red">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('pink')">
            <md-icon class="is-color-pink">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('purple')">
            <md-icon class="is-color-purple">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('deeppurple')">
            <md-icon class="is-color-deeppurple">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('indigo')">
            <md-icon class="is-color-indigo">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('blue')">
            <md-icon class="is-color-blue">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('lightblue')">
            <md-icon class="is-color-lightblue">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('cyan')">
            <md-icon class="is-color-cyan">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('teal')">
            <md-icon class="is-color-teal">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('green')">
            <md-icon class="is-color-green">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('lightgreen')">
            <md-icon class="is-color-lightgreen">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('lime')">
            <md-icon class="is-color-lime">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('yellow')">
            <md-icon class="is-color-yellow">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('amber')">
            <md-icon class="is-color-amber">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('orange')">
            <md-icon class="is-color-orange">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('brown')">
            <md-icon class="is-color-brown">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('white')">
            <md-icon class="is-color-white">brightness_1</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-icon-button" @click="closeColorPickDialog('black')">
            <md-icon class="is-color-black">brightness_1</md-icon>
          </md-button>
        </div>
      </div>
    </md-dialog>
  </div>
</template>

<script>
  export default {
    name: 'settings',
    data () {
      return {
        showColourPickDialog: false,
        showAddChoicePrompt: false,
        addChoiceValue: '',
        colourPickValue: null
      }
    },
    computed: {
      track () {
        return this.$store.getters.getTrackById(this.$route.params.id)
      }
    },
    methods: {
      saveSettings () {
        this.$store.dispatch('updateTrack', this.track)
      },
      closeColorPickDialog (colour) {
        this.colourPickValue = colour
        this.showColourPickDialog = false
        if (colour != null) {
          this.track.colour = colour
        }
      },
      closeAddChoicePrompt () {
        this.addChoiceValue = ' '
        this.$nextTick(() => {
          this.addChoiceValue = ''
        })
      },
      confirmAddChoicePrompt () {
        if (this.track.choices == null) {
          this.track.choices = []
        }
        if (this.track.choices.indexOf(this.addChoiceValue) === -1) {
          this.track.choices.push(this.addChoiceValue)
        }
        this.closeAddChoicePrompt()
      },
      deleteChoice (choice) {
        this.track.choices.splice(this.track.choices.indexOf(choice), 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~vue-material/dist/theme/engine";

  .full-control > .md-list {
    width: 320px;
    max-width: 100%;
    /*height: 400px;*/
    display: inline-block;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
    vertical-align: top;
    margin-bottom: 50px;
  }

  .color-dialog {
    padding: 0px 20px 20px 20px;
    width: 200px;
  }

  .color-dialog .md-layout .md-layout-item .md-icon-button {
    margin: 0px;
  }

  .is-color-red {
    color: md-get-palette-color(red, 500) !important;
  }

  .is-color-pink {
    color: md-get-palette-color(pink, 500) !important;
  }

  .is-color-purple {
    color: md-get-palette-color(purple, 500) !important;
  }

  .is-color-deeppurple {
    color: md-get-palette-color(deeppurple, 500) !important;
  }

  .is-color-indigo {
    color: md-get-palette-color(indigo, 500) !important;
  }

  .is-color-blue {
    color: md-get-palette-color(blue, 500) !important;
  }

  .is-color-lightblue{
    color: md-get-palette-color(lightblue, 500) !important;
  }

  .is-color-cyan {
    color: md-get-palette-color(cyan, 500) !important;
  }

  .is-color-teal {
    color: md-get-palette-color(teal, 500) !important;
  }

  .is-color-green {
    color: md-get-palette-color(green, 500) !important;
  }

  .is-color-lightgreen {
    color: md-get-palette-color(lightgreen, 500) !important;
  }

  .is-color-lime {
    color: md-get-palette-color(lime, 500) !important;
  }

  .is-color-yellow {
    color: md-get-palette-color(yellow, 500) !important;
  }

  .is-color-amber {
    color: md-get-palette-color(amber, 500) !important;
  }

  .is-color-orange {
    color: md-get-palette-color(orange, 500) !important;
  }

  .is-color-brown {
    color: md-get-palette-color(brown, 500) !important;
  }

  .is-color-grey {
    color: md-get-palette-color(grey, 500) !important;
  }

  .is-color-white{
    color: md-get-palette-color(white, 500) !important;
  }

  .is-color-black{
    color: md-get-palette-color(black, 500) !important;
  }
</style>
