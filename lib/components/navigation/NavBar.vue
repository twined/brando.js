<template>
  <header>
    <section class="container">
      <transition name="fade" appear>
        <NavMenu />
      </transition>
      <transition name="fade" appear>
        <nav class="navbar navbar-toggleable-xxl">
          <div class="logo-wrapper">
            byHands admin
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
import NavMenu from './NavMenu'
import CurrentUser from '../CurrentUser'
export default {
  components: {
    CurrentUser,
    NavMenu
  },

  computed: {
    ...mapGetters('users', [
      'me'
    ])
  },

  data () {
    return {}
  }
}
</script>
