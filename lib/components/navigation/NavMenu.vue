<template>
  <div class="navigation-menu">
    <button id="hamburger" class="hamburger hamburger--spin" type="button" @click.prevent="toggleMenu">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>
    <div class="menu-backdrop" v-click-outside="onClickOutside">
      <div class="menu-content d-flex flex-column align-items-center">
        <div class="top">
          <div class="avatar mx-auto">
            <img :src="me.avatar" alt="Profilbilde" class="rounded-circle img-fluid">
          </div>
          <div class="info text-center mb-3 text-white">
            <h6>
              <router-link @click.stop.native="close" :to="{ name: 'profile' }" exact v-if="me">
                {{ me.full_name }}
              </router-link>
            </h6>
          </div>
        </div>

        <div class="menu-line-main">
          <router-link @click.stop.native="close" :to="{ name: 'dashboard' }" exact>
            <span class="nav-icon">
              <i class="fal fa-tachometer-alt"></i>
            </span>
            Mitt dashboard
          </router-link>
        </div>

        <NavMenuItem text="Brukere" @expanding="expanding" icon="fal fa-fw fa-user-circle">
          <router-link data-index="1" key="1" @click.native="close" :to="{ name: 'users' }" exact>Oversikt</router-link>
          <router-link data-index="2" key="2" @click.native="close" :to="{ name: 'user-create' }">Opprett ny bruker</router-link>
        </NavMenuItem>

        <NavMenuItem text="Bilder" @expanding="expanding" icon="fal fa-fw fa-image">
          <router-link data-index="1" key="1" @click.native="close" :to="{ name: 'images' }" exact>Oversikt</router-link>
        </NavMenuItem>

        <template v-for="(entry, idx) in entries">
          <NavMenuItem :key="idx" @expanding="expanding" :text="entry.text" :icon="entry.icon">
            <router-link v-for="(child, idx) in entry.children" :key="idx" @click.native="close" :to="child.to" exact>
              {{ child.text }}
            </router-link>
          </NavMenuItem>
        </template>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import NavMenuItem from './NavMenuItem.vue'

export default {
  components: {
    NavMenuItem
  },

  data () {
    return {
      menuOpen: false
    }
  },

  computed: {
    ...mapGetters('menu', [
      'entries'
    ]),
    ...mapGetters('users', [
      'me'
    ])
  },

  created () {
    console.log(this)
  },

  methods: {
    toggleMenu (e) {
      if (!this.menuOpen) {
        document.body.classList.add('menu-open')
        e.currentTarget.classList.add('is-active')
        this.menuOpen = true
      } else {
        document.body.classList.remove('menu-open')
        e.currentTarget.classList.remove('is-active')
        this.menuOpen = false
      }
    },

    onClickOutside () {
      if (this.menuOpen) {
        this.hide()
      }
    },

    expanding (a) {
      this.closeSubs()
    },

    closeSubs () {
      let subs = document.getElementsByClassName('menu-line-wrapper open')
      for (let sub of Array.from(subs)) {
        sub.classList.remove('open')
      }
    },

    hide () {
      let hamburger = document.getElementById('hamburger')
      hamburger.classList.remove('is-active')
      document.body.classList.remove('menu-open')
      this.menuOpen = false
    },

    close (e) {
      this.hide()

      // if the link clicked is not in a sub-nav, we close all the other subnavs!
      if (e.currentTarget.parentNode.classList.contains('menu-line-main')) {
        this.closeSubs()
      }
    }
  }
}
</script>
