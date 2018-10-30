import {
  STORE_SETTING,
  STORE_TEMPLATES,
  SET_TEMPLATE_MODE
} from './mutation-types'

export const config = {
  namespaced: true,
  // initial state
  state: {
    templates: [],
    templateMode: false,
    settings: {
      siteName: 'SITE NAME'
    }
  },

  // mutations
  mutations: {
    [STORE_SETTING] (state, configEntry) {
      state.settings = { ...state.settings, ...configEntry }
    },

    [STORE_TEMPLATES] (state, templates) {
      state.templates = templates
    },

    [SET_TEMPLATE_MODE] (state) {
      state.templateMode = true
    }
  },

  getters: {
    settings: state => {
      return state.settings
    },

    siteName: state => {
      return state.settings.siteName
    },

    templates: state => {
      return state.templates
    },

    templateMode: state => {
      return state.templateMode
    }
  }
}
