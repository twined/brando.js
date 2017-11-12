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
              <KInputRadios
                v-model="user.role"
                :value="user.role"
                :options="[
                  { name: 'Superbruker', value: 'superuser' },
                  { name: 'Admin', value: 'admin' },
                  { name: 'Stab', value: 'staff' }
                ]"
                name="user[role]"
                label="Rolle"
                v-validate="'required'"
                data-vv-name="user[role]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[role]')"
                :error-text="errors.first('user[role]')"
              />

              <KInputSelect
                v-model="user.language"
                :value="user.language"
                :options="[
                  { name: 'Norsk', value: 'nb' },
                  { name: 'Engelsk', value: 'en' }
                ]"
                name="user[language]"
                label="Språk"
                v-validate="'required'"
                data-vv-name="user[language]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[language]')"
                :error-text="errors.first('user[language]')"
              />

              <KInput
                v-model="user.full_name"
                :value="user.full_name"
                name="user[full_name]"
                label="Navn"
                placeholder="Navn"
                v-validate="'required'"
                data-vv-name="user[full_name]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[full_name]')"
                :error-text="errors.first('user[full_name]')"
              />

              <KInputEmail
                v-model="user.email"
                :value="user.email"
                name="user[email]"
                label="Epost"
                placeholder="Epost"
                v-validate="'required'"
                data-vv-name="user[email]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[email]')"
                :error-text="errors.first('user[email]')"
              />
              <KInputPassword
                v-model="user.password"
                :value="user.password"
                name="user[password]"
                label="Passord"
                placeholder="Passord"
                v-validate="'min:6|confirmed:user[password_confirm]'"
                data-vv-name="user[password]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[password]')"
                :error-text="errors.first('user[password]')"
              />
              <KInputPassword
                v-model="user.password_confirm"
                :value="user.password_confirm"
                name="user[password_confirm]"
                label="Bekreft passord"
                placeholder="Bekreft passord"
                data-vv-name="user[password_confirm]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('user[password_confirm]')"
                :error-text="errors.first('user[password_confirm]')"
              />

              <button @click.prevent="validateBeforeSubmit" class="btn btn-secondary mt-4">
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
import { pick } from '../../utils'

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
      const params = pick(
        this.user,
        'full_name', 'email', 'password', 'role', 'language', 'username'
      )
      try {
        await this.updateUser({userId: this.user.id, userParams: params})
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
