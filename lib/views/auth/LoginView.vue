<template>
  <div class="login">
    <div class="container-fluid" id="content" style="margin-top: 4rem;">
      <div class="d-flex justify-content-center flex-wrap align-items-center" style="height: 100%;">
        <div class="col-md-4 offset-md-1">
          <div class="card-group">
            <div class="card">
              <div class="card-header">
                <h5 class="section mb-0">Logg inn</h5>
              </div>
              <div class="card-body">
                <p class="text-muted">Logg inn med epost og passord</p>
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
              <div class="card-footer text-muted">
                <button @click.prevent="login" class="btn btn-secondary">
                  Logg inn
                </button>
                <div class="col-sm-6 float-right text-xs-right">
                  <button type="button" class="btn btn-link px-0 text-small text-primary float-right">Glemt passord?</button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      }
    }
  },

  computed: {
    ...mapGetters([
      'me'
    ])
  },

  created () {
    console.debug('created <login />')
    if (this.checkExpired()) {
      alertInfo('Utløpt', 'Brukerøkten din er utløpt. Vennligst logg inn på nytt')
    } else {
      let token = localStorage.getItem('token')

      if (token && this.me) {
        this.$router.push({ name: 'company-overview', params: { companyHash: this.me.active_company.hash } })
      }
    }
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
              localStorage.setItem('token', json.jwt)
              window.location = '/admin'
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
