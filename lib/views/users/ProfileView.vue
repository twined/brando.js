<template>
  <!-- overview tab -->
  <div class="profile-form">
    <div class="container">
      <div class="row" v-show="!loading">
        <div class="col-md-3">
          <div class="card">
            <img class="card-img-top img-fluid" :src="me.avatar_medium" alt="Avatar">
            <div class="card-body text-center">
              <h4 class="card-title mb-3">{{ me.full_name }}</h4>
              <span class="badge badge-outline-primary badge-sm text-uppercase">administrator</span>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="card">
            <div class="card-header">
              <h5 class="section mb-0">Endre brukerinformasjon</h5>
            </div>
            <div class="card-body">
              <KInput
                v-model="profile.full_name"
                :value="profile.full_name"
                name="profile[full_name]"
                label="Navn"
                placeholder="Navn"
                v-validate="'required'"
                data-vv-name="profile[full_name]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[full_name]')"
                :error-text="errors.first('profile[full_name]')"
              />

              <KInputEmail
                v-model="profile.email"
                :value="profile.email"
                name="profile[email]"
                label="Epost"
                placeholder="Epost"
                v-validate="'required|email'"
                data-vv-name="profile[email]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[email]')"
                :error-text="errors.first('profile[email]')"
              />

              <KInputSelect
                v-model="profile.language"
                :value="profile.language"
                :options="[
                  { name: 'Norsk', value: 'nb' },
                  { name: 'Engelsk', value: 'en' }
                ]"
                name="profile[language]"
                label="Språk"
                v-validate="'required'"
                data-vv-name="profile[language]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[language]')"
                :error-text="errors.first('profile[language]')"
              />

              <KInputPassword
                v-model="profile.password"
                :value="profile.password"
                name="profile[password]"
                label="Passord"
                placeholder="Passord"
                v-validate="'min:6|confirmed:profile[password_confirm]'"
                data-vv-name="profile[password]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[password]')"
                :error-text="errors.first('profile[password]')"
              />
              <KInputPassword
                v-model="profile.password_confirm"
                :value="profile.password_confirm"
                name="profile[password_confirm]"
                label="Bekreft passord"
                placeholder="Bekreft passord"
                data-vv-name="profile[password_confirm]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[password_confirm]')"
                :error-text="errors.first('profile[password_confirm]')"
              />

              <KInputImage
                v-model="profile.avatar"
                :value="profile.avatar"
                :width="100"
                :height="100"
                name="profile[avatar]"
                label="Profilbilde"
                v-validate="'required'"
                data-vv-name="profile[avatar]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('profile[avatar]')"
                :error-text="errors.first('profile[avatar]')"
              />

              <button @click.prevent="validate" class="btn btn-outline-secondary" type="submit">Lagre</button>
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
import { userAPI } from '../../api/user'
import { showError } from '../../utils/showError'

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
        'language': '',
        'avatar': ''
      }
    }
  },

  created () {
    console.debug('created <ProfileView />')
    this.token = this.$store.getters['users/token']

    this.profile = {
      email: this.me.email,
      full_name: this.me.full_name,
      avatar: this.me.avatar,
      language: this.me.language
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

    validate (e) {
      this.$validator.validateAll().then(() => {
        this.submitForm()
      }).catch((e) => {
        console.log(e)
        alertError('Feil i skjema', 'Vennligst se over og rett feil i rødt')
      })
    },

    async submitForm () {
      console.log('-- submitForm()')
      try {
        await userAPI.updateUser(this.me.id, this.profile)
        this.storeMe()
        this.$toast.success({message: 'Lagret profilinformasjon'})
      } catch (err) {
        showError(err)
      }
    },

    ...mapActions('users', [
      'storeMe'
    ])
  }
}
</script>
