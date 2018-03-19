<template>
  <div>
    <!--<form novalidate class="md-layout md-alignment-center-center" @submit.prevent="validateRegister">-->
      <!--<md-card class="md-layout-item md-size-50 md-small-size-100">-->
        <!--<md-card-header>-->
          <!--<div class="md-title">Sign In</div>-->
        <!--</md-card-header>-->

        <!--<md-card-content>-->
          <!--<md-field :class="getValidationClass('email')">-->
            <!--<label for="email">Email</label>-->
            <!--<md-input name="email" id="email" v-model="form.email" :disabled="sending" @input="$v.$touch()"/>-->
            <!--<span class="md-error" v-if="!$v.form.email.required">Email is required</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.email.emailNotRegistered">This email has not been registered.</span>-->
          <!--</md-field>-->
          <!--<md-field :class="getValidationClass('password')">-->
            <!--<label for="password">Password</label>-->
            <!--<md-input name="password" id="password" type="password" v-model="form.password" :disabled="sending" @input="$v.$touch(); hideWrongPwdMsg = true"/>-->
            <!--<span class="md-error" v-if="!$v.form.password.required">Password is required.</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.password.minLength">Password must have at least {{ $v.form.password.$params.minLength.min }} characters.</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.password.wrongPassword">The password is incorrect.</span>-->
          <!--</md-field>-->

          <!--<router-link to="/register">Don't have an account?  Sign up here!</router-link>-->

        <!--</md-card-content>-->

        <!--<md-progress-bar md-mode="indeterminate" v-if="sending"></md-progress-bar>-->

        <!--<md-card-actions>-->
          <!--<md-button type="submit" class="md-primary" :disabled="sending">Sign In</md-button>-->
        <!--</md-card-actions>-->

      <!--</md-card>-->
    <!--</form>-->

    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    email,
    minLength
  } from 'vuelidate/lib/validators'

  export default {
    name: 'register',
    mixins: [validationMixin],
    data: () => {
      return {
        form: {
          email: '',
          password: ''
        },
        loggedIn: false,
        sending: false,
        lastEmail: null,
        hideWrongPwdMsg: false,
        serverError: {}
      }
    },
    validations: {
      form: {
        email: {
          required,
          email,
          emailNotRegistered () {
            // Returns true if valid (no server error) and false if invalid (server error)
            return !(this.serverError && this.serverError.code === 'auth/user-not-found' &&
              this.form.email === this.lastEmail)
          }
        },
        password: {
          required,
          minLength: minLength(6),
          wrongPassword () {
            // Returns true if valid (no server error) and false if invalid (server error)
            return !(this.serverError && this.serverError.code === 'auth/wrong-password' &&
                     this.hideWrongPwdMsg === false)
          }
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        /* $v is the vuelidate object (see docs for more info) */
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.email = ''
        this.form.password = ''
        this.hideWrongPwdMsg = false
        this.serverError = null
      },
      submitForm () {
        this.sending = true
        // Call your API
        firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then(
          user => {
            alert('Signed In!')
            this.lastEmail = this.form.email
            this.loggedIn = true
            this.sending = false
            this.clearForm()
            this.$router.replace('/')
          },
          err => {
            this.hideWrongPwdMsg = false
            this.lastEmail = this.form.email
            this.serverError = err
            this.$v.$touch()
            this.sending = false
            // console.log(err)
          }
        )
      },
      validateRegister () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.submitForm()
        }
      }
    },
    mounted () {
      var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
      }
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }
</script>

<style scoped> /* "scoped" limits the css to this component only! */
  /*.md-progress-bar {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*right: 0;*/
    /*left: 0;*/
  /*}*/
</style>
