<template>
  <!-- overview tab -->
  <div class="profile-form">
    <div class="container">
      <div
        v-show="!loading"
        class="row">
        <div class="col-md-3">
          <div class="card p-4">
            <img
              :src="me.avatar ? me.avatar.medium : '/images/admin/avatar.png'"
              class="card-img-top img-fluid"
              alt="Avatar">
            <div class="card-body text-center p-0 pt-3">
              <h4 class="card-title mb-3">
                {{ me.full_name }}
              </h4>
              <span class="badge badge-outline-primary badge-sm text-uppercase">administrator</span>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="card">
            <div class="card-header">
              <h5 class="section mb-0">
                Endre brukerinformasjon
              </h5>
            </div>
            <div class="card-body">
              <KInput
                v-model="profile.full_name"
                v-validate="'required'"
                :value="profile.full_name"
                :has-error="errors.has('profile[full_name]')"
                :error-text="errors.first('profile[full_name]')"
                name="profile[full_name]"
                label="Navn"
                placeholder="Navn"
                data-vv-name="profile[full_name]"
                data-vv-value-path="innerValue" />

              <KInputEmail
                v-model="profile.email"
                v-validate="'required|email'"
                :value="profile.email"
                :has-error="errors.has('profile[email]')"
                :error-text="errors.first('profile[email]')"
                name="profile[email]"
                label="Epost"
                placeholder="Epost"
                data-vv-name="profile[email]"
                data-vv-value-path="innerValue" />

              <KInputSelect
                v-model="profile.language"
                v-validate="'required'"
                :value="profile.language"
                :options="[
                  { name: 'Norsk', value: 'nb' },
                  { name: 'Engelsk', value: 'en' }
                ]"
                :has-error="errors.has('profile[language]')"
                :error-text="errors.first('profile[language]')"
                name="profile[language]"
                label="Språk"
                data-vv-name="profile[language]"
                data-vv-value-path="innerValue" />

              <KInputPassword
                v-model="profile.password"
                v-validate="'min:6|confirmed:profile[password_confirm]'"
                :value="profile.password"
                :has-error="errors.has('profile[password]')"
                :error-text="errors.first('profile[password]')"
                name="profile[password]"
                label="Passord"
                placeholder="Passord"
                data-vv-name="profile[password]"
                data-vv-value-path="innerValue" />
              <KInputPassword
                v-model="profile.password_confirm"
                :value="profile.password_confirm"
                :has-error="errors.has('profile[password_confirm]')"
                :error-text="errors.first('profile[password_confirm]')"
                name="profile[password_confirm]"
                label="Bekreft passord"
                placeholder="Bekreft passord"
                data-vv-name="profile[password_confirm]"
                data-vv-value-path="innerValue" />

              <KInputImage
                v-model="profile.avatar"
                :value="profile.avatar"
                :has-error="errors.has('profile[avatar]')"
                :error-text="errors.first('profile[avatar]')"
                name="profile[avatar]"
                label="Profilbilde"
                data-vv-name="profile[avatar]"
                data-vv-value-path="innerValue" />

              <button
                class="btn btn-outline-secondary"
                type="submit"
                @click.prevent="validate">
                Lagre
              </button>
              <router-link
                :to="{ name: 'dashboard' }"
                class="btn btn-outline-secondary"
                exact>
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
import nprogress from 'nprogress'
import { mapActions, mapGetters } from 'vuex'
import { alertError } from '../../utils/alerts.js'
import { userAPI } from '../../api/user'
import { showError, validateImageParams, stripParams } from '../../utils'

export default {
  data () {
    return {
      loading: true,
      profile: {
        name: '',
        email: '',
        language: '',
        avatar: {}
      }
    }
  },

  inject: [
    'userChannel'
  ],

  computed: {
    ...mapGetters('users', [
      'me'
    ])
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

  methods: {
    validate (e) {
      this.$validator.validateAll().then(() => {
        this.submitForm()
      }).catch((e) => {
        console.error(e)
        alertError('Feil i skjema', 'Vennligst se over og rett feil i rødt')
      })
    },

    async submitForm () {
      nprogress.start()
      let params = { ...this.profile }
      stripParams(params, ['__typename', 'id', 'password_confirm'])
      validateImageParams(params, ['avatar'])

      try {
        await userAPI.updateUser(this.me.id, params)
        this.storeMe()
        this.$toast.success({ message: 'Lagret profilinformasjon' })
        nprogress.done()
      } catch (err) {
        showError(err)
        nprogress.done()
      }
    },

    ...mapActions('users', [
      'storeMe'
    ])
  }
}
</script>
