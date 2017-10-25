<template>
  <transition name="fade" mode="out-in" appear>
    <div class="users-create">
      <div class="container" id="content">
        <div class="cards">
          <div class="card w-50 mx-auto">
            <div class="card-header">
              <h5 class="section mb-0">Ny bruker</h5>
            </div>
            <div class="card-body">
              <div :class="{'form-group': true, 'has-danger': errors.has('user[role]') }">
                <label class="control-label" for="user_type">Rolle</label>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="superuser" type="checkbox">
                    Superbruker
                  </label>
                </div>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="admin" type="checkbox">
                    Admin
                  </label>
                </div>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="staff" type="checkbox">
                    Stab
                  </label>
                </div>
                <div class="form-control-feedback">{{ errors.first('role') }}</div>
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[language]') }">
                <label class="control-label" for="user_type">Språk</label>
                <select v-model="user.language" v-validate="'required'" class="form-control" id="language" name="language">
                  <option value="nb">Norsk</option>
                  <option disabled value="en">English</option>
                </select>
                <div class="form-control-feedback">{{ errors.first('language') }}</div>
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[full_name]') }">
                <label class="control-label" for="profile_full_name">Navn<span><i class="fa fa-exclamation-circle text-danger"></i>{{ errors.first('user[full_name]') }}</span></label>
                <input v-model="user.full_name" v-validate="'required'" class="form-control form-control-danger" id="user_full_name" name="user[full_name]" type="text">
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[email]') }">
                <label class="control-label" for="user_email">Epost<span><i class="fa fa-exclamation-circle text-danger"></i>{{ errors.first('user[email]') }}</span></label>
                <input v-model="user.email" v-validate="'required|email'" class="form-control form-control-danger" id="user_email" name="user[email]" type="text">
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[password]') }">
                <label class="control-label" for="user_password">Passord<span><i class="fa fa-exclamation-circle text-danger"></i>{{ errors.first('user[password]') }}</span></label>
                <input v-model="user.password" v-validate="'required|confirmed:user[password_confirm]'" class="form-control form-control-danger" id="user_password" name="user[password]" type="password">
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[password_confirm]') }">
                <label class="control-label" for="user_password_confirm">Bekreft passord<span><i class="fa fa-exclamation-circle text-danger"></i>{{ errors.first('user[password_confirm]') }}</span></label>
                <input v-model="user.password_confirm" v-validate="'required'" class="form-control form-control-danger" id="user_password_confirm" name="user[password_confirm]" type="password">
              </div>
              <button @click.prevent="validateBeforeSubmit" class="btn btn-secondary">
                Lagre ny bruker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { alertError } from '../../utils/alerts'

export default {
  data () {
    return {
      user: {
        full_name: '',
        email: '',
        language: 'nb',
        role: 'user',
        password: '',
        password_confirm: ''
      }
    }
  },

  inject: [
    'adminChannel'
  ],

  created () {
    console.debug('created <UsersCreate />')
  },

  methods: {
    async submitForm () {
      try {
        await this.storeUser(this.user)
        this.$iziToast.success({ message: 'La til ny bruker' })
        this.user = {
          full_name: '',
          email: '',
          role: [],
          language: 'nb',
          password: '',
          password_confirm: ''
        }
        this.$validator.clean()
        this.$router.push({ name: 'users' })
      } catch (err) {
        throw err
      }
    },

    validateBeforeSubmit (e) {
      this.loading = true
      this.$validator.validateAll().then(() => {
        this.submitForm()
      }).catch(() => {
        alertError('Feil i skjema', 'Vennligst se over og rett feil i rødt')
        this.loading = false
      })
    },
    ...mapActions('users', [
      'storeUser'
    ])
  }
}
</script>
