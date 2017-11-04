<template>
  <header>
    <section class="container">
      <transition name="slide-fade-top-slow" appear>
        <Hamburger />
      </transition>
      <transition name="slide-fade-top-slow" appear>
        <nav class="navbar navbar-toggleable-xxl">
          <div class="logo-wrapper">
            {{ siteName }}
            <img class="logo img-fluid" src="/images/logo-circle.png">
          </div>

          <div class="align-items-center" id="navbar-collapse">
            <ul class="nav navbar-right ml-auto">
              <!-- <QuickSearch />
              <MessageNotifications />
              <Notifications />
              -->
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
      'me'
    ]),
    ...mapGetters('config', [
      'siteName'
    ])
  },

  data () {
    return {}
  }
}
</script>
