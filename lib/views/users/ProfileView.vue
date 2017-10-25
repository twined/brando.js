<template>
  <!-- overview tab -->
  <div class="profile-form">
    <div class="container">
      <div class="row" v-show="!loading">
        <div class="col-md-3">
          <div class="card">
            <img class="card-img-top img-fluid" :src="me.avatar" alt="Avatar">
            <div class="card-body">
              <h4 class="card-title text-center mb-3 text-strong">{{ me.full_name }}</h4>
              <h6 class="card-subtitle mb-3 text-muted text-center">administrator</h6>
              <VueCoreImageUpload
                text="Last opp profilbilde"
                class="btn btn-outline-secondary btn-block"
                :crop="false"
                :maxFileSize="5242880"
                extensions="png,gif,jpeg,jpg"
                :headers="{'authorization': `Bearer ${token}`}"
                :url="'/admin/api/upload/users/' + this.me.id + '/avatar/upload'"

                @errorhandle="uploadError"
                @imageuploading="uploading"
                @imageuploaded="uploadComplete">
              </VueCoreImageUpload>
              <button @click="changePassword" class="btn btn-outline-secondary btn-block">
                Skift passord
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="card">
            <div class="card-header">
              <h5 class="section mb-0">Endre brukerinformasjon</h5>
            </div>
            <div class="card-body">
              <div :class="{'form-group': true, 'has-danger': errors.has('profile[full_name]') }">
                <label class="control-label" for="profile_full_name">Navn</label>
                <input v-model="profile.full_name" v-validate="'required'" class="form-control form-control-danger" id="profile_full_name" name="profile[full_name]" type="text">
                <div class="form-control-feedback">{{ errors.first('profile[full_name]') }}</div>
              </div>

              <div class="row">
                <div class="col">
                  <div :class="{'form-group': true, 'has-danger': errors.has('profile[email]') }">
                    <label class="control-label" for="profile_email">Epost</label>
                    <input v-model="profile.email" v-validate="'required|email'" class="form-control form-control-danger" id="profile_email" name="profile[email]" type="text">
                    <div class="form-control-feedback">{{ errors.first('profile[email]') }}</div>
                  </div>
                </div>
              </div>
              <button @click.prevent="validateBeforeSubmit" class="btn btn-outline-secondary" type="submit">Lagre</button>
              <router-link :to="{ name: 'dashboard' }" class="btn btn-outline-secondary" exact>
                Tilbake
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { alertError, alertSuccess } from '../../utils/alerts.js'

import VueCoreImageUpload from 'vue-core-image-upload'

export default {
  components: {
    VueCoreImageUpload
  },

  data () {
    return {
      loading: true,
      profile: {
        'name': '',
        'email': '',
        'phone': '',
        'avatar': ''
      }
    }
  },

  created () {
    console.debug('created <ProfileView />')
    this.token = localStorage.getItem('token')

    this.profile = {
      email: this.me.email,
      full_name: this.me.full_name,
      avatar: this.me.avatar
    }

    this.loading = false
  },

  inject: [
    'userChannel'
  ],

  computed: {
    ...mapGetters('users', [
      'me'
    ])
  },

  methods: {
    uploading (res) {
      console.info('uploading')
    },

    uploadComplete (res) {
      if (res.error) {
        let reason = ''
        switch (res.error) {
          case 'Unauthenticated':
            reason = 'Ingen tilgang til API'
            break
        }

        alertError('Feil', 'Feil ved opplasting<br/ ><br/ >&rarr; ' + reason)

        return
      }

      switch (res.status) {
        case 200:
          this.profile.avatar = res.avatar
          this.$root.$refs.toast.showToast('Profilbilde oppdatert', {theme: 'success'})
          this.storeMe()
          break
        default:
          alertError('Feil', 'Serverfeil ved opplasting<br/ >')
      }

      console.log(res)
    },

    uploadError (err) {
      switch (err) {
        case 'FILE IS TOO LARGER MAX FILE IS 5.00MB':
          alertError('Feil', 'Filen er for stor. Max 5mb!')
          break
        default:
          alertError('Feil', 'Ukjent feil ved opplasting')
      }
    },

    validateBeforeSubmit (e) {
      this.$validator.validateAll().then(() => {
        this.submitForm()
      }).catch((e) => {
        console.log(e)
        alertError('Feil i skjema', 'Vennligst se over og rett feil i rødt')
      })
    },

    submitForm () {
      console.log('-- submitForm()')
      this.userChannel.channel
        .push('profile:update', { profile: this.profile })
        .receive('ok', () => {
          this.storeMe().then(() => {
            this.$root.$refs.toast.showToast('Lagret endringer', {theme: 'success'})
            this.$router.push({ name: 'profile' })
          })
        })
        .receive('error', payload => alertError('Feil', payload.msg))
    },

    changePassword () {
      this.userChannel.channel
        .push('change_password')
        .receive('ok', payload => {
          alertSuccess('Mail sendt', 'Vi har sendt deg en mail med link for å skifte passordet ditt')
        })
    },

    ...mapActions('users', [
      'storeMe'
    ])
  }
}
</script>
