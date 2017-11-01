<template>
  <div class="login">
    <div class="container-fluid fixed-full-content">
      <div class="d-flex justify-content-center flex-wrap align-items-center" style="height: 100%;">
        <transition name="slide-fade-top-slow" appear>
          <div class="col-md-3 offset-md-1" v-if="!loading">
            <h5 class="section mb-0">Logg inn</h5>
            <div>
              <div class="input-group mb-3">
                <span class="input-group-addon">
                  <i class="fa fa-user"></i>
                </span>
                <input v-model="user.email" class="form-control" name="email" type="email" placeholder="Epost">
              </div>
              <div class="input-group mb-4">
                <span class="input-group-addon">
                  <i class="fa fa-lock"></i>
                </span>
                <input v-model="user.password" class="form-control" name="password" type="password" placeholder="Passord" @keyup.13="login">
              </div>
            </div>
            <div>
              <button @click.prevent="login" class="btn btn-secondary">
                Logg inn
              </button>
              <div class="col-sm-6 float-right text-xs-right">
                <button type="button" class="btn btn-link px-0 text-small text-primary float-right">Glemt passord?</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

import { alertInfo, alertError } from '../../utils/alerts'
import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      loading: 0
    }
  },

  computed: {
    ...mapGetters('users', ['me'])
  },

  created () {
    this.loading++
    console.debug('created <login />')
    if (this.checkExpired()) {
      alertInfo('Utløpt', 'Brukerøkten din er utløpt. Vennligst logg inn på nytt')
    } else {
      let token = this.$store.getters['users/token']

      if (token && this.me) {
        this.$router.push({ name: 'dashboard' })
      }
    }
  },

  mounted () {
    this.loading--
  },

  methods: {
    async login () {
      const fmData = new FormData()

      fmData.append('email', this.user.email)
      fmData.append('password', this.user.password)

      try {
        const response = await fetch('/admin/auth/login', {
          method: 'post',
          body: fmData
        })

        const json = await response.json()

        switch (response.status) {
          case 401:
            alertError('Feil', 'Feil brukernavn eller passord')
            break
          case 201:
            if (json) {
              this.$store.commit('users/STORE_TOKEN', json.jwt)
              this.$router.push({ name: 'dashboard' })
            }
            break
          case 423:
            alertError('Feil', 'Låst konto')
            break
        }
      } catch (err) {
        throw err
      }
    },

    checkExpired () {
      var queryDict = {}
      document.location.search.substr(1).split('&').forEach(function (item) {
        queryDict[item.split('=')[0]] = item.split('=')[1]
      })

      if (queryDict['expired']) {
        return true
      }
      return false
    }
  }
}
</script>
