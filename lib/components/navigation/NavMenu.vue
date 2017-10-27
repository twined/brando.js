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
import NavMenuItem from './NavMenuItem'

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
        console.log('click outside menu')
        this.hide()
      }
    },

    expanding (a) {
      console.log('expanding menu — contract all others here')
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

<style lang="scss">
@import "../../styles/variables";

$sidenav-font-size: 1rem;
$sidenav-menu-padding: 1rem;
$sidenav-menu-bg-color: transparent;
$sidenav-submenu-bg-color: mix(map-get($theme-colors, "secondary"), black, 70%);
$sidenav-submenu-bg-hover-color: mix(map-get($theme-colors, "secondary"), black, 60%);
$sidenav-menu-bg-hover-color: mix(map-get($theme-colors, "secondary"), white, 90%);

@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";

.menu-content h6 a {
  color: #fff;
  transition: border 1200ms ease;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);

  &:hover {
    text-decoration: none;
    color: #fff;
    transition: border 200ms ease;
    border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  }
}

.toggle-button {
  width: 90px;
  z-index: 2050;
  color: map-get($theme-colors, "secondary");
  position: fixed;
}

.menu-open .toggle-button {
  color: #fff;
}

.menu-backdrop {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  background-color: map-get($theme-colors, "secondary");
  transform: translateX(-100%);
  transition: transform 250ms ease-out;
  z-index: 2000;
  overflow-y: scroll;
  overflow-x: hidden;

  @include media-breakpoint-down(xs) {
    width: 100%;
  }

  .avatar {
    width: 150px;
    margin-bottom: 1.5rem;

    img {
      border: 4px solid #fff;
    }
  }

  .menu-content {
    z-index: 2010;
    margin-bottom: 1.5rem;

    .top {
      width: 100%;
      padding-top: 1.5rem;
      padding-bottom: .5rem;
      background-color: rgba(0, 0, 0, 0.05);
    }

    .info {
      h4 {
        a {
          color: #fff;
          border-bottom: 2px solid transparent;

          &:hover {
            border-bottom: 2px solid rgba(255, 255, 255, 0.25);
          }
        }
      }

      h5 {
        font-weight: 100;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.65);
      }
    }

    .menu-line-main {
      width: 100%;
      padding-top: $sidenav-menu-padding;
      padding-bottom: $sidenav-menu-padding;

      // border-top: 5px solid transparent;
      background-color: $sidenav-menu-bg-color;
      font-weight: 200;

      span.nav-icon {
        font-size: 1rem;
        text-align: center;
        display: block;
        position: absolute;
        left: 27px;
        color: rgba(255, 255, 255, 0.22);
        padding-top: 5px;
        top: -5px;
      }

      a, span {
        color: #fff;
        font-size: $sidenav-font-size;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-align: center;
        display: block;
        position: relative;
        &:hover {
          border-bottom: none;
          text-decoration: none;
        }
      }
    }

    .menu-line-wrapper .menu-line .caption,
    .menu-line-main {
      &:hover {
        transition: background 300ms ease;
        background-color: $sidenav-menu-bg-hover-color;
      }
    }

    .menu-line-wrapper {
      position: relative;
      width: 100%;

      &:after {
        content: '\F343';
        font-family: 'Font Awesome 5 light';
        position: absolute;
        top: 9px;
        right: 20px;
        color: rgba(255, 255, 255, 0.22);
        font-size: $sidenav-font-size;
        transition: transform 0.7s ease;
        pointer-events: none;
        padding: .6rem;
        font-weight: 300;
        -webkit-font-smoothing: antialiased;
        line-height: 1;
      }

      div.caption {
        position: relative;
        cursor: pointer;
        padding-top: $sidenav-menu-padding;
        padding-bottom: $sidenav-menu-padding;

        // border-top: 5px solid transparent;
        background-color: $sidenav-menu-bg-color;
        font-weight: 200;
        color: #fff;
        font-size: $sidenav-font-size;
        text-align: center;
        display: block;
        text-transform: uppercase;
        letter-spacing: 1px;

        span.nav-icon {
          font-size: 1rem;
          text-align: center;
          display: block;
          position: absolute;
          left: 27px;
          color: rgba(255, 255, 255, 0.22);
        }
      }

      .menu-line-sub {
        width: 100%;
        display: block;
        max-height: 0;
        transition: max-height 250ms;
        overflow: hidden;

        a {
          display: block;
          text-align: center;
          padding: 1rem 0;
          font-weight: 200;
          border-bottom: 0 solid $sidenav-menu-bg-color;
          background-color: $sidenav-submenu-bg-color;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: .8rem;
          color: rgba(255,255,255,.8);

          &:hover {
            transition: background 300ms ease;
            background-color: $sidenav-submenu-bg-hover-color;
            text-decoration: none;
            color: #fff;
          }

          &.router-link-exact-active {
            font-weight: bold;
          }
        }

        span {
          font-size: 1rem;
        }
      }

      &.open {
        &:after {
          transform: rotate(450deg);
        }

        .menu-line-sub {
          max-height: 600px;
          transition: max-height 450ms;
        }
      }
    }
  }
}

.menu-open .menu-backdrop {
  transform: translateX(0);
}

.nav.sub-nav {
  @include media-breakpoint-down(sm) {
    flex-direction: column;

    li a {
      display: block;
      padding: 5px 15px !important;
      margin: 3px !important;
      background-color: #fff;
    }
  }
}

/*!
 * Hamburgers
 * @description Tasty CSS-animated hamburgers
 * @author Jonathan Suh @jonsuh
 * @site https://jonsuh.com/hamburgers
 * @link https://github.com/jonsuh/hamburgers
 */
.hamburger {
  padding: 15px 0;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter, margin-left;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  margin-top: 5px;
  overflow: visible;
  z-index: 9999;
  position: absolute;

  &.is-active {
    position: absolute;
    left: 10px;
  }
}

.hamburger:hover {
  // opacity: 0.7;
}

.hamburger:focus {
  outline: none;
}

.hamburger-box {
  width: 40px;
  height: 24px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px;
}

.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
  width: 20px;
  height: 3px;
  background-color: map-get($theme-colors, "secondary");
  border-radius: 4px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

.hamburger-inner::before, .hamburger-inner::after {
  content: "";
  display: block;
}

.hamburger-inner::before {
  top: -7px;
}

.hamburger-inner::after {
  bottom: -7px;
}

/*
   * 3DX
   */
.hamburger--3dx .hamburger-box {
  perspective: 80px;
}

.hamburger--3dx .hamburger-inner {
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dx .hamburger-inner::before, .hamburger--3dx .hamburger-inner::after {
  transition: transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dx.is-active .hamburger-inner {
  background-color: transparent;
  transform: rotateY(180deg);
}

.hamburger--3dx.is-active .hamburger-inner::before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--3dx.is-active .hamburger-inner::after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}

/*
   * 3DX Reverse
   */
.hamburger--3dx-r .hamburger-box {
  perspective: 80px;
}

.hamburger--3dx-r .hamburger-inner {
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dx-r .hamburger-inner::before, .hamburger--3dx-r .hamburger-inner::after {
  transition: transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dx-r.is-active .hamburger-inner {
  background-color: transparent;
  transform: rotateY(-180deg);
}

.hamburger--3dx-r.is-active .hamburger-inner::before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--3dx-r.is-active .hamburger-inner::after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}

/*
   * 3DY
   */
.hamburger--3dy .hamburger-box {
  perspective: 80px;
}

.hamburger--3dy .hamburger-inner {
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dy .hamburger-inner::before, .hamburger--3dy .hamburger-inner::after {
  transition: transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dy.is-active .hamburger-inner {
  background-color: transparent;
  transform: rotateX(-180deg);
}

.hamburger--3dy.is-active .hamburger-inner::before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--3dy.is-active .hamburger-inner::after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}

/*
   * 3DY Reverse
   */
.hamburger--3dy-r .hamburger-box {
  perspective: 80px;
}

.hamburger--3dy-r .hamburger-inner {
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dy-r .hamburger-inner::before, .hamburger--3dy-r .hamburger-inner::after {
  transition: transform 0s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.hamburger--3dy-r.is-active .hamburger-inner {
  background-color: transparent;
  transform: rotateX(180deg);
}

.hamburger--3dy-r.is-active .hamburger-inner::before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--3dy-r.is-active .hamburger-inner::after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}

/*
   * Arrow
   */
.hamburger--arrow.is-active .hamburger-inner::before {
  transform: translate3d(-8px, 0, 0) rotate(-45deg) scale(0.7, 1);
}

.hamburger--arrow.is-active .hamburger-inner::after {
  transform: translate3d(-8px, 0, 0) rotate(45deg) scale(0.7, 1);
}

/*
   * Arrow Right
   */
.hamburger--arrow-r.is-active .hamburger-inner::before {
  transform: translate3d(8px, 0, 0) rotate(45deg) scale(0.7, 1);
}

.hamburger--arrow-r.is-active .hamburger-inner::after {
  transform: translate3d(8px, 0, 0) rotate(-45deg) scale(0.7, 1);
}

/*
   * Arrow Alt
   */
.hamburger--arrowalt .hamburger-inner::before {
  transition: top 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hamburger--arrowalt .hamburger-inner::after {
  transition: bottom 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hamburger--arrowalt.is-active .hamburger-inner::before {
  top: 0;
  transform: translate3d(-8px, -10px, 0) rotate(-45deg) scale(0.7, 1);
  transition: top 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

.hamburger--arrowalt.is-active .hamburger-inner::after {
  bottom: 0;
  transform: translate3d(-8px, 10px, 0) rotate(45deg) scale(0.7, 1);
  transition: bottom 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

/*
   * Arrow Alt Right
   */
.hamburger--arrowalt-r .hamburger-inner::before {
  transition: top 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hamburger--arrowalt-r .hamburger-inner::after {
  transition: bottom 0.1s 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hamburger--arrowalt-r.is-active .hamburger-inner::before {
  top: 0;
  transform: translate3d(8px, -10px, 0) rotate(45deg) scale(0.7, 1);
  transition: top 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

.hamburger--arrowalt-r.is-active .hamburger-inner::after {
  bottom: 0;
  transform: translate3d(8px, 10px, 0) rotate(-45deg) scale(0.7, 1);
  transition: bottom 0.1s ease, transform 0.1s 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

/*
   * Boring
   */
.hamburger--boring .hamburger-inner, .hamburger--boring .hamburger-inner::before, .hamburger--boring .hamburger-inner::after {
  transition-property: none;
}

.hamburger--boring.is-active .hamburger-inner {
  transform: rotate(45deg);
}

.hamburger--boring.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
}

.hamburger--boring.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
}

/*
   * Collapse
   */
.hamburger--collapse .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-duration: 0.13s;
  transition-delay: 0.13s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--collapse .hamburger-inner::after {
  top: -20px;
  transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0.1s linear;
}

.hamburger--collapse .hamburger-inner::before {
  transition: top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--collapse.is-active .hamburger-inner {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--collapse.is-active .hamburger-inner::after {
  top: 0;
  opacity: 0;
  transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0.1s 0.22s linear;
}

.hamburger--collapse.is-active .hamburger-inner::before {
  top: 0;
  transform: rotate(-90deg);
  transition: top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Collapse Reverse
   */
.hamburger--collapse-r .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-duration: 0.13s;
  transition-delay: 0.13s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--collapse-r .hamburger-inner::after {
  top: -20px;
  transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0.1s linear;
}

.hamburger--collapse-r .hamburger-inner::before {
  transition: top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--collapse-r.is-active .hamburger-inner {
  transform: translate3d(0, -10px, 0) rotate(45deg);
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--collapse-r.is-active .hamburger-inner::after {
  top: 0;
  opacity: 0;
  transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0.1s 0.22s linear;
}

.hamburger--collapse-r.is-active .hamburger-inner::before {
  top: 0;
  transform: rotate(90deg);
  transition: top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Elastic
   */
.hamburger--elastic .hamburger-inner {
  top: 2px;
  transition-duration: 0.275s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hamburger--elastic .hamburger-inner::before {
  top: 10px;
  transition: opacity 0.125s 0.275s ease;
}

.hamburger--elastic .hamburger-inner::after {
  top: 20px;
  transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hamburger--elastic.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(135deg);
  transition-delay: 0.075s;
}

.hamburger--elastic.is-active .hamburger-inner::before {
  transition-delay: 0s;
  opacity: 0;
}

.hamburger--elastic.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(-270deg);
  transition-delay: 0.075s;
}

/*
   * Elastic Reverse
   */
.hamburger--elastic-r .hamburger-inner {
  top: 2px;
  transition-duration: 0.275s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hamburger--elastic-r .hamburger-inner::before {
  top: 10px;
  transition: opacity 0.125s 0.275s ease;
}

.hamburger--elastic-r .hamburger-inner::after {
  top: 20px;
  transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hamburger--elastic-r.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(-135deg);
  transition-delay: 0.075s;
}

.hamburger--elastic-r.is-active .hamburger-inner::before {
  transition-delay: 0s;
  opacity: 0;
}

.hamburger--elastic-r.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(270deg);
  transition-delay: 0.075s;
}

/*
   * Emphatic
   */
.hamburger--emphatic {
  overflow: hidden;
}

.hamburger--emphatic .hamburger-inner {
  transition: background-color 0.125s 0.175s ease-in;
}

.hamburger--emphatic .hamburger-inner::before {
  left: 0;
  transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, left 0.125s 0.175s ease-in;
}

.hamburger--emphatic .hamburger-inner::after {
  top: 10px;
  right: 0;
  transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, right 0.125s 0.175s ease-in;
}

.hamburger--emphatic.is-active .hamburger-inner {
  transition-delay: 0s;
  transition-timing-function: ease-out;
  background-color: transparent;
}

.hamburger--emphatic.is-active .hamburger-inner::before {
  left: -80px;
  top: -80px;
  transform: translate3d(80px, 80px, 0) rotate(45deg);
  transition: left 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.hamburger--emphatic.is-active .hamburger-inner::after {
  right: -80px;
  top: -80px;
  transform: translate3d(-80px, 80px, 0) rotate(-45deg);
  transition: right 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
}

/*
   * Emphatic Reverse
   */
.hamburger--emphatic-r {
  overflow: hidden;
}

.hamburger--emphatic-r .hamburger-inner {
  transition: background-color 0.125s 0.175s ease-in;
}

.hamburger--emphatic-r .hamburger-inner::before {
  left: 0;
  transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, left 0.125s 0.175s ease-in;
}

.hamburger--emphatic-r .hamburger-inner::after {
  top: 10px;
  right: 0;
  transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335), top 0.05s 0.125s linear, right 0.125s 0.175s ease-in;
}

.hamburger--emphatic-r.is-active .hamburger-inner {
  transition-delay: 0s;
  transition-timing-function: ease-out;
  background-color: transparent;
}

.hamburger--emphatic-r.is-active .hamburger-inner::before {
  left: -80px;
  top: 80px;
  transform: translate3d(80px, -80px, 0) rotate(-45deg);
  transition: left 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.hamburger--emphatic-r.is-active .hamburger-inner::after {
  right: -80px;
  top: 80px;
  transform: translate3d(-80px, -80px, 0) rotate(45deg);
  transition: right 0.125s ease-out, top 0.05s 0.125s linear, transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
}

/*
   * Slider
   */
.hamburger--slider .hamburger-inner {
  top: 2px;
}

.hamburger--slider .hamburger-inner::before {
  top: 10px;
  transition-property: transform, opacity;
  transition-timing-function: ease;
  transition-duration: 0.15s;
}

.hamburger--slider .hamburger-inner::after {
  top: 20px;
}

.hamburger--slider.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--slider.is-active .hamburger-inner::before {
  transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
  opacity: 0;
}

.hamburger--slider.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(-90deg);
}

/*
   * Slider Reverse
   */
.hamburger--slider-r .hamburger-inner {
  top: 2px;
}

.hamburger--slider-r .hamburger-inner::before {
  top: 10px;
  transition-property: transform, opacity;
  transition-timing-function: ease;
  transition-duration: 0.15s;
}

.hamburger--slider-r .hamburger-inner::after {
  top: 20px;
}

.hamburger--slider-r.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(-45deg);
}

.hamburger--slider-r.is-active .hamburger-inner::before {
  transform: rotate(45deg) translate3d(5.71429px, -6px, 0);
  opacity: 0;
}

.hamburger--slider-r.is-active .hamburger-inner::after {
  transform: translate3d(0, -20px, 0) rotate(90deg);
}

/*
   * Spring
   */
.hamburger--spring .hamburger-inner {
  top: 2px;
  transition: background-color 0s 0.13s linear;
}

.hamburger--spring .hamburger-inner::before {
  top: 10px;
  transition: top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spring .hamburger-inner::after {
  top: 20px;
  transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spring.is-active .hamburger-inner {
  transition-delay: 0.22s;
  background-color: transparent;
}

.hamburger--spring.is-active .hamburger-inner::before {
  top: 0;
  transition: top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translate3d(0, 10px, 0) rotate(45deg);
}

.hamburger--spring.is-active .hamburger-inner::after {
  top: 0;
  transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translate3d(0, 10px, 0) rotate(-45deg);
}

/*
   * Spring Reverse
   */
.hamburger--spring-r .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-duration: 0.13s;
  transition-delay: 0s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spring-r .hamburger-inner::after {
  top: -20px;
  transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), opacity 0s linear;
}

.hamburger--spring-r .hamburger-inner::before {
  transition: top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spring-r.is-active .hamburger-inner {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--spring-r.is-active .hamburger-inner::after {
  top: 0;
  opacity: 0;
  transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), opacity 0s 0.22s linear;
}

.hamburger--spring-r.is-active .hamburger-inner::before {
  top: 0;
  transform: rotate(90deg);
  transition: top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Stand
   */
.hamburger--stand .hamburger-inner {
  transition: transform 0.075s 0.15s cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color 0s 0.075s linear;
}

.hamburger--stand .hamburger-inner::before {
  transition: top 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--stand .hamburger-inner::after {
  transition: bottom 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--stand.is-active .hamburger-inner {
  transform: rotate(90deg);
  background-color: transparent;
  transition: transform 0.075s 0s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0s 0.15s linear;
}

.hamburger--stand.is-active .hamburger-inner::before {
  top: 0;
  transform: rotate(-45deg);
  transition: top 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--stand.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(45deg);
  transition: bottom 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Stand Reverse
   */
.hamburger--stand-r .hamburger-inner {
  transition: transform 0.075s 0.15s cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color 0s 0.075s linear;
}

.hamburger--stand-r .hamburger-inner::before {
  transition: top 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--stand-r .hamburger-inner::after {
  transition: bottom 0.075s 0.075s ease-in, transform 0.075s 0s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--stand-r.is-active .hamburger-inner {
  transform: rotate(-90deg);
  background-color: transparent;
  transition: transform 0.075s 0s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0s 0.15s linear;
}

.hamburger--stand-r.is-active .hamburger-inner::before {
  top: 0;
  transform: rotate(-45deg);
  transition: top 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--stand-r.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(45deg);
  transition: bottom 0.075s 0.1s ease-out, transform 0.075s 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Spin
   */
.hamburger--spin .hamburger-inner {
  transition-duration: 0.22s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spin .hamburger-inner::before {
  transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in, background-color 0.5s ease-in;
}

.hamburger--spin .hamburger-inner::after {
  transition: bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19), background-color 0.5s ease-in;
}

.hamburger--spin.is-active .hamburger-inner {
  transform: rotate(225deg);
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  background-color: #fff;
}

.hamburger--spin.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
  background-color: #fff;
}

.hamburger--spin.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
  transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
  background-color: #fff;
}

/*
   * Spin Reverse
   */
.hamburger--spin-r .hamburger-inner {
  transition-duration: 0.22s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spin-r .hamburger-inner::before {
  transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
}

.hamburger--spin-r .hamburger-inner::after {
  transition: bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--spin-r.is-active .hamburger-inner {
  transform: rotate(-225deg);
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--spin-r.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
}

.hamburger--spin-r.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(90deg);
  transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Squeeze
   */
.hamburger--squeeze .hamburger-inner {
  transition-duration: 0.075s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--squeeze .hamburger-inner::before {
  transition: top 0.075s 0.12s ease, opacity 0.075s ease;
}

.hamburger--squeeze .hamburger-inner::after {
  transition: bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--squeeze.is-active .hamburger-inner {
  transform: rotate(45deg);
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.hamburger--squeeze.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.075s ease, opacity 0.075s 0.12s ease;
}

.hamburger--squeeze.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
  transition: bottom 0.075s ease, transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/*
   * Vortex
   */
.hamburger--vortex .hamburger-inner {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex .hamburger-inner::before, .hamburger--vortex .hamburger-inner::after {
  transition-duration: 0s;
  transition-delay: 0.1s;
  transition-timing-function: linear;
}

.hamburger--vortex .hamburger-inner::before {
  transition-property: top, opacity;
}

.hamburger--vortex .hamburger-inner::after {
  transition-property: bottom, transform;
}

.hamburger--vortex.is-active .hamburger-inner {
  transform: rotate(765deg);
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex.is-active .hamburger-inner::before, .hamburger--vortex.is-active .hamburger-inner::after {
  transition-delay: 0s;
}

.hamburger--vortex.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
}

.hamburger--vortex.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(90deg);
}

/*
   * Vortex Reverse
   */
.hamburger--vortex-r .hamburger-inner {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex-r .hamburger-inner::before, .hamburger--vortex-r .hamburger-inner::after {
  transition-duration: 0s;
  transition-delay: 0.1s;
  transition-timing-function: linear;
}

.hamburger--vortex-r .hamburger-inner::before {
  transition-property: top, opacity;
}

.hamburger--vortex-r .hamburger-inner::after {
  transition-property: bottom, transform;
}

.hamburger--vortex-r.is-active .hamburger-inner {
  transform: rotate(-765deg);
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex-r.is-active .hamburger-inner::before, .hamburger--vortex-r.is-active .hamburger-inner::after {
  transition-delay: 0s;
}

.hamburger--vortex-r.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
}

.hamburger--vortex-r.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
}

</style>
