<template>
  <transition name="fade" mode="out-in" appear>
    <li id="nav-profile-dropdown" class="dropdown" v-click-outside="onClickOutside">
      <a @click.stop="toggle"
        class="d-inline-flex align-items-center dropdown-toggle user-box"
        :class="(showDropdown ? 'active' : '')"
        id="profile-dropdown-button"
        aria-haspopup="true"
      >
        <div class="avatar">
          <img :src="user.avatar" class="rounded-circle avatar-xs" alt="Avatar">
        </div>
        <div class="userinfo hidden-sm-down">
          {{ user.full_name }}
          <span>
            administrator
          </span>
        </div>
      </a>
      <div :class="'dropdown-menu dropdown-menu-right has-icons' + (showDropdown ? ' show' : '')" v-show="showDropdown">
        <router-link @click.native="showDropdown = false" :to="{ name: 'profile' }" class="dropdown-item" exact>
          <i class="fal fa-fw mr-2 fa-user"></i><span>Min profil</span>
        </router-link>
        <button @click.prevent="logout" class="dropdown-item">
          <i class="fal fa-fw mr-2 fa-sign-out"></i><span>Logg ut</span>
        </button>
      </div>
    </li>
  </transition>
</template>
<script>

export default {
  props: {
    'user': {
      type: Object,
      default: () => {
        return {full_name: 'Name Nameson', avatar: 'https://sivbo.no/images/avatar.png', role: 'admin'}
      }
    }
  },

  created () {
    console.log('created <CurrentUser />')
  },

  data () {
    return {
      showDropdown: false
    }
  },

  methods: {
    onClickOutside () {
      this.showDropdown = false
    },

    toggle () {
      if (this.showDropdown) {
        this.showDropdown = false
      } else {
        this.showDropdown = true
      }
    },

    async logout () {
      let token = localStorage.getItem('token')
      let fmData = new FormData()
      fmData.append('jwt', token)
      try {
        const response = await fetch('/admin/auth/logout', {
          method: 'post',
          body: fmData
        })

        switch (response.status) {
          case 200:
            const json = await response.json()
            if (json) {
              localStorage.removeItem('token')
              window.location = '/admin'
            }
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  }
}
</script>
