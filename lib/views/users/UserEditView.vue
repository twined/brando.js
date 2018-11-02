<template>
  <transition
    name="fade"
    mode="out-in"
    appear>
    <div class="users-edit">
      <div
        id="content"
        class="container">
        <div class="cards">
          <div class="card w-50">
            <div class="card-header">
              <h5 class="section mb-0">Endre bruker</h5>
            </div>
            <div class="card-body">
              <KInputRadios
                v-validate="'required'"
                v-model="user.role"
                :value="user.role"
                :options="[
                  { name: 'Superbruker', value: 'superuser' },
                  { name: 'Admin', value: 'admin' },
                  { name: 'Stab', value: 'staff' }
                ]"
                :has-error="errors.has('user[role]')"
                :error-text="errors.first('user[role]')"
                name="user[role]"
                label="Rolle"
                data-vv-name="user[role]"
                data-vv-value-path="innerValue"
              />

              <KInputSelect
                v-validate="'required'"
                v-model="user.language"
                :value="user.language"
                :options="[
                  { name: 'Norsk', value: 'nb' },
                  { name: 'Engelsk', value: 'en' }
                ]"
                :has-error="errors.has('user[language]')"
                :error-text="errors.first('user[language]')"
                name="user[language]"
                label="Språk"
                data-vv-name="user[language]"
                data-vv-value-path="innerValue"
              />

              <KInput
                v-validate="'required'"
                v-model="user.full_name"
                :value="user.full_name"
                :has-error="errors.has('user[full_name]')"
                :error-text="errors.first('user[full_name]')"
                name="user[full_name]"
                label="Navn"
                placeholder="Navn"
                data-vv-name="user[full_name]"
                data-vv-value-path="innerValue"
              />

              <KInputEmail
                v-validate="'required'"
                v-model="user.email"
                :value="user.email"
                :has-error="errors.has('user[email]')"
                :error-text="errors.first('user[email]')"
                name="user[email]"
                label="Epost"
                placeholder="Epost"
                data-vv-name="user[email]"
                data-vv-value-path="innerValue"
              />
              <KInputPassword
                v-validate="'min:6|confirmed:user[password_confirm]'"
                v-model="user.password"
                :value="user.password"
                :has-error="errors.has('user[password]')"
                :error-text="errors.first('user[password]')"
                name="user[password]"
                label="Passord"
                placeholder="Passord"
                data-vv-name="user[password]"
                data-vv-value-path="innerValue"
              />
              <KInputPassword
                v-model="user.password_confirm"
                :value="user.password_confirm"
                :has-error="errors.has('user[password_confirm]')"
                :error-text="errors.first('user[password_confirm]')"
                name="user[password_confirm]"
                label="Bekreft passord"
                placeholder="Bekreft passord"
                data-vv-name="user[password_confirm]"
                data-vv-value-path="innerValue"
              />

              <button
                class="btn btn-secondary mt-4"
                @click.prevent="validateBeforeSubmit">
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

  props: {
    userId: {
      type: String,
      required: true,
      default: null
    }
  },
  data () {
    return {
      user: {}
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
        await this.updateUser({ userId: this.user.id, userParams: params })
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
