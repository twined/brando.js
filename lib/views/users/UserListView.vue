<template>
  <div
    v-if="!loading"
    class="users container"
    appear>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="section mb-0">Brukere</h5>
          </div>
          <div class="card-body">
            <div class="jumbotron text-center">
              <h1 class="display-1 text-uppercase text-strong">Brukere</h1>
              <p class="lead">Administrér brukere i backenden.</p>
              <hr class="my-4">
              <p class="lead">
                <router-link
                  v-if="['admin', 'superuser'].includes(me.role)"
                  :to="{ name: 'user-create' }"
                  class="btn btn-secondary"
                  exact>
                  Legg til bruker
                </router-link>
              </p>
            </div>

            <table
              v-if="allUsers.length"
              class="table table-airy">
              <tbody
                is="transition-group"
                name="slide-fade-top-slow">
                <tr
                  v-for="user in allUsers"
                  :key="user.id">
                  <td class="fit">
                    <div class="avatar">
                      <img
                        :src="user.avatar"
                        class="rounded-circle avatar-xs"
                        alt="Avatar">
                    </div>
                  </td>
                  <td>
                    <router-link :to="{ name: 'user-edit', params: { userId: user.id } }">
                      {{ user.full_name }}<br>
                    </router-link>
                    <span class="text-muted text-sm">{{ user.email }}</span>
                  </td>
                  <td class="fit">
                    <Flag :value="user.language" />
                  </td>
                  <td class="fit">
                    <span class="badge badge-outline-primary badge-sm mr-1 text-uppercase badge-block">
                      {{ user.role }}
                    </span>
                  </td>
                  <td
                    v-if="['superuser'].includes(me.role)"
                    class="text-center fit">
                    <b-dropdown
                      v-if="user.id !== me.id"
                      variant="white"
                      no-caret>
                      <template slot="button-content">
                        <i class="k-dropdown-icon"/>
                      </template>
                      <button
                        :class="{'dropdown-item': true, 'disabled': ['superuser'].includes(me.role)}"
                        @click.prevent="setDeactivated(user)">
                        <i class="fal fa-fw fa-window-close mr-4"/>Deaktivér bruker
                      </button>
                      <router-link
                        :to="{ name: 'user-edit', params: { userId: user.id } }"
                        :class="{'dropdown-item': true}"
                        tag="button">
                        <i class="fal fa-fw fa-pencil mr-4"/>Endre brukerdata
                      </router-link>
                    </b-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: 0
    }
  },

  computed: {
    ...mapGetters('users', [
      'me',
      'allUsers'
    ])
  },

  inject: [
    'adminChannel'
  ],

  async created () {
    console.debug('created <UserListView />')
    this.loading++
    await this.storeUsers()
    this.loading--
  },

  methods: {
    setUser (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'user' })
        .receive('ok', payload => {
          this.setEmployeeRole({ employee: e, role: 'user' })
        })
    },

    setStaff (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'staff' })
        .receive('ok', payload => {
          this.setEmployeeRole({ employee: e, role: 'staff' })
        })
    },

    setAdmin (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'admin' })
        .receive('ok', payload => {
          this.setEmployeeRole({ employee: e, role: 'admin' })
        })
    },

    setOwner (e) {
      if (e.role === 'owner') {
        return
      }

      if (this.role !== 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'owner' })
        .receive('ok', payload => {
          this.setEmployeeRole({ employee: e, role: 'owner' })
        })
    },

    setDeactivated (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('user:deactivate', { employee_id: e.id })
        .receive('ok', payload => {
          this.decActiveEmployeeCount()
          this.setEmployeeStatus({ employee: e, status: 'deactivated' })
        })
    },

    setActivated (e) {
      this.adminChannel.channel
        .push('user:activate', { employee_id: e.id })
        .receive('ok', payload => {
          this.incActiveEmployeeCount()
          this.setEmployeeStatus({ employee: e, status: 'active' })
        })
    },

    removeEmployee (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('employee:remove', { employee_id: e.id })
        .receive('ok', payload => {

        })
    },

    ...mapActions('users', [
      'storeUsers'
    ])
  }
}
</script>
