<template>
  <div class="users container" v-if="!loading" appear>
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
                <router-link :to="{ name: 'user-create' }" class="btn btn-secondary mb-4" exact v-if="['admin', 'superuser'].includes(me.role)">
                  Legg til bruker
                </router-link>
              </p>
            </div>

            <table class="table table-airy" v-if="allUsers.length">
              <tbody>
                <tr :key="user.id" v-for="user in allUsers">
                  <td class="fit">
                    <div class="avatar">
                      <img :src="user.avatar" class="rounded-circle avatar-xs" alt="Avatar">
                    </div>
                  </td>
                  <td>
                    {{ user.full_name }}<br>
                    <span class="text-muted text-small">{{ user.email }}</span>
                  </td>
                  <td class="fit">
                    <span class="badge badge-outline-primary badge-sm mr-1 text-uppercase badge-block">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="text-center fit" v-if="['superuser'].includes(me.role)">
                    <b-dropdown variant="white" no-caret v-if="user.id !== me.id">
                      <template slot="button-content">
                        <i class="k-dropdown-icon"></i>
                      </template>
                      <button
                        @click.prevent="setDeactivated(user)"
                        :class="{'dropdown-item': true, 'disabled': ['superuser'].includes(me.role)}">
                        <i class="fal fa-fw fa-window-close mr-4"></i>Deaktivér bruker
                      </button>
                      <router-link
                        :to="{ name: 'user-edit', params: { userId: user.id } }"
                        tag="button"
                        :class="{'dropdown-item': true}"
                      >
                        <i class="fal fa-fw fa-pencil mr-4"></i>Endre brukerdata
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

  async created () {
    console.debug('created <UserListView />')
    this.loading++
    await this.storeUsers()
    this.loading--
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

  methods: {
    setUser (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'user' })
        .receive('ok', payload => {
          this.setEmployeeRole({employee: e, role: 'user'})
        })
    },

    setStaff (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'staff' })
        .receive('ok', payload => {
          this.setEmployeeRole({employee: e, role: 'staff'})
        })
    },

    setAdmin (e) {
      if (e.role === 'owner') {
        return
      }

      this.adminChannel.channel
        .push('role:set', { employee_id: e.id, role: 'admin' })
        .receive('ok', payload => {
          this.setEmployeeRole({employee: e, role: 'admin'})
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
          this.setEmployeeRole({employee: e, role: 'owner'})
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
