<template>
  <header>
    <section class="container">
      <transition name="slide-fade-top-slow" appear>
        <div class="presences" v-if="lobbyPresences !== {}">
          <span class="text-uppercase text-xs">online &rarr; </span>
          <transition-group class="d-inline-flex justify-content-center" tag="div" name="fade">
            <div :key="id" class="user-presence" v-for="(p, id) in lobbyPresences">
              <div class="avatar">
                <img :src="userById(id).avatar" class="rounded-circle avatar-xxs">
              </div>
            </div>
          </transition-group>
        </div>
      </transition>
      <transition name="slide-fade-top-slow" appear>
        <Hamburger />
      </transition>
      <transition name="slide-fade-top-slow" appear>
        <nav class="navbar navbar-toggleable-xxl">
          <div class="logo-wrapper">
            {{ siteName }}
          </div>

          <div class="align-items-center" id="navbar-collapse">
            <ul class="nav navbar-right ml-auto">
              <CurrentUser :user="me" />
            </ul>
          </div>
        </nav>
      </transition>
    </section>
  </header>
</template>

<script>

import { mapGetters } from 'vuex'
import Hamburger from './Hamburger.vue'
import CurrentUser from '../CurrentUser.vue'

export default {
  components: {
    CurrentUser,
    Hamburger
  },

  computed: {
    ...mapGetters('users', [
      'me',
      'userById',
      'lobbyPresences'
    ]),
    ...mapGetters('config', [
      'siteName'
    ])
  },

  data () {
    return {}
  },

  methods: {
  }
}
</script>
