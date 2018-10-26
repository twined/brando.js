<template>
  <div id="app" :class="{'loaded': !loading, 'menu-open': status, 'fullscreen': fullScreen}" v-if="token && !loading">
    <NProgress />
    <NavMenu />
    <NavBar />
    <div id="content">
      <transition name="fade" mode="out-in" @after-leave="afterLeave" appear>
        <router-view class="view"></router-view>
      </transition>
    </div>
  </div>
  <div v-else-if="!token">
    <div id="content">
      <transition name="fade" mode="out-in" @after-leave="afterLeave" appear>
        <router-view class="view"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import apollo from 'kurtz/lib/api/apolloClient'
import NavBar from 'kurtz/lib/components/navigation/NavBar.vue'
import NavMenu from 'kurtz/lib/components/navigation/NavMenu.vue'
import NProgress from 'kurtz/lib/components/navigation/NProgress.vue'

export default {
  components: {
    NavMenu,
    NavBar,
    NProgress
  },

  data () {
    return {
      loading: 1,
      fullScreen: false
    }
  },

  computed: {
    ...mapGetters('users', [
      'me',
      'token'
    ]),
    ...mapGetters('menu', [
      'status'
    ])
  },

  provide () {
    const userChannel = {}
    const adminChannel = {}

    Object.defineProperty(userChannel, 'channel', {
      enumerable: true,
      get: () => this.userChannel
    })

    Object.defineProperty(adminChannel, 'channel', {
      enumerable: true,
      get: () => this.adminChannel
    })

    return { userChannel, adminChannel }
  },

  watch: {
    token (value) {
      if (value) {
        this.initializeApp()
      }
    },

    '$route' () {
      console.log(this.$route.meta)
      if (this.$route.meta.fullScreen) {
        this.fullScreen = true
      } else {
        this.fullScreen = false
      }
    }
  },

  async created () {
    console.debug('created <App />')

    if (this.$route.meta.fullScreen) {
      this.fullScreen = true
    }

    if (this.token) {
      // check if the token is valid — might be old
      let fmData = new FormData()
      fmData.append('jwt', this.token)

      const response = await fetch('/admin/auth/verify', {
        method: 'post',
        body: fmData
      })

      switch (response.status) {
        case 200:
          await this.initializeApp()
          break
        case 406:
          this.$store.commit('users/REMOVE_TOKEN')
          window.location = '/admin/login?expired=true'
          break
        case 401:
          this.$store.commit('users/REMOVE_TOKEN')
          window.location = '/admin/login?expired=true'
      }
    } else {
      this.loading = false
      this.loaded = true
    }
  },

  methods: {
    async initializeApp () {
      this.initializeApolloClient()
      this.connectSocket()
      try {
        await this.storeMe()
        await this.storeUsers()
        this.joinAdminChannel()
        this.joinUserChannel()
        this.loading = false
      } catch (err) {
        throw err
      }
    },

    initializeApolloClient () {
      apollo.initialize()
    },

    afterLeave () {
      window.scrollTo(0, 0)
    },

    joinUserChannel () {
      this.userChannel = this.$socket.channel(`user:${this.me.id}`, {})
      this.userChannel.join()
        .receive('ok', userId => {
          console.debug(`== Ble medlem av brukerkanal:${this.me.id} med bruker:${userId}`)
          this.loading = false
        })
        .receive('error', resp => { console.error('!! Kunne ikke påmeldes ', resp) })

      this.userChannel.on('token:refresh', jwt => {
        this.$store.commit('users/STORE_TOKEN', jwt)
      })
    },

    joinAdminChannel () {
      this.adminChannel = this.$socket.channel('admin', {})
      this.adminChannel.join()
        .receive('ok', userId => {
          console.debug(`== Ble medlem av adminkanal med bruker:${userId}`)
          this.loading = false
        })
        .receive('error', resp => { console.error('!! Kunne ikke påmeldes ', resp) })

      // receive initial presence data from server, sent after join
      this.adminChannel.on('admin:presence_state', state => {
        this.storeLobbyPresences(state)
      })

      // receive 'presence_diff' from server, containing join/leave events
      this.adminChannel.on('presence_diff', diff => {
        this.storeLobbyPresencesDiff(diff)
      })

      // request presences
      this.adminChannel.push('admin:list_presence')
    },

    ...mapActions('users', [
      'storeMe',
      'storeUsers',
      'storeLobbyPresencesDiff',
      'storeLobbyPresences'
    ])
  }
}
</script>
