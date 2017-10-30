<template>
  <transition name="fade" mode="out-in" appear>
    <div class="users-edit">
      <div class="container" id="content">
        <div class="cards">
          <div class="card w-50 mx-auto">
            <div class="card-header">
              <h5 class="section mb-0">Endre bruker</h5>
            </div>
            <div class="card-body">
              <div :class="{'form-group': true, 'has-danger': errors.has('user[role]') }">
                <label class="control-label" for="user_type">Rolle</label>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="superuser" type="radio">
                    Superbruker
                  </label>
                </div>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="admin" type="radio">
                    Admin
                  </label>
                </div>
                <div class="form-check">
                  <label class="form-check-label">
                    <input v-model="user.role" class="form-check-input" value="staff" type="radio">
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
                <input v-model="user.password" v-validate="'min:6|confirmed:user[password_confirm]'" class="form-control form-control-danger" id="user_password" name="user[password]" type="password">
              </div>

              <div :class="{'form-group': true, 'has-danger': errors.has('user[password_confirm]') }">
                <label class="control-label" for="user_password_confirm">Bekreft passord<span><i class="fa fa-exclamation-circle text-danger"></i>{{ errors.first('user[password_confirm]') }}</span></label>
                <input v-model="user.password_confirm" class="form-control form-control-danger" id="user_password_confirm" name="user[password_confirm]" type="password">
              </div>
              <button @click.prevent="validateBeforeSubmit" class="btn btn-secondary">
                Oppdatér bruker
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
import { userAPI } from '../../api/user'
import { alertError } from '../../utils/alerts'

export default {
  data () {
    return {
      user: {}
    }
  },

  props: {
    userId: {
      type: String,
      required: true,
      default: null
    }
  },

  inject: [
    'adminChannel'
  ],

  async created () {
    console.debug('created <UsersEdit />')
    try {
      const user = await userAPI.getUser(this.userId)
      this.user = { ...user }
    } catch (err) {
      console.log(err)
    }
  },

  methods: {
    async submitForm () {
      try {
        await this.updateUser(this.user)
        this.$toast.success({ message: 'Bruker oppdatert' })
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
      'storeUser',
      'updateUser'
    ])
  }
}
</script>
