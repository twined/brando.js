import moment from 'moment-timezone'
import Sortable from 'sortablejs'

import VueTimeago from 'vue-timeago'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import Multiselect from 'vue-multiselect'
import vClickOutside from 'v-click-outside'

import VueIziToast from '../utils/toast'
import VuePhoenixSocket from '../utils/socket'

import * as filters from '../filters'
import * as kurtzComponents from 'kurtz/lib/components'

import TIMEAGO_CONFIG from './config/TIMEAGO_CONFIG'
import MOMENT_NB_LOCALE from './config/MOMENT_NB_LOCALE'
import VEE_LOCALE_NO from './config/VEE_LOCALE_NO'

export function installKurtz (Vue) {
  moment.defineLocale('nb', MOMENT_NB_LOCALE)
  moment.locale('nb')
  moment.tz.setDefault('Europe/Oslo')

  // register Sortable as a global directive
  Vue.directive('sortable', {
    inserted: function (el, binding) {
      const s = new Sortable(el, binding.value || {})
      return s
    }
  })

  // register global utility filters.
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })

  // register all kurtz components
  for (const component in kurtzComponents) {
    Vue.component(component, kurtzComponents[component])
  }

  Vue.use(Vuex)
  Vue.use(VueRouter)
  Vue.use(VueIziToast)
  Vue.use(VuePhoenixSocket)
  Vue.use(VeeValidate, {
    classes: true,
    locale: 'no',
    dictionary: {
      no: VEE_LOCALE_NO
    }
  })
  Vue.use(vClickOutside)
  Vue.use(BootstrapVue)
  Vue.use(VueTimeago, TIMEAGO_CONFIG)
  Vue.component('FileUpload', VueUploadComponent)
  Vue.component('Multiselect', Multiselect)

  Vue.config.productionTip = false
}

export function installConfig (store, config) {
  store.commit('config/STORE_SETTING', config)
}
