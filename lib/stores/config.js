import {
  STORE_SETTING
} from './mutation-types'

export const config = {
  namespaced: true,
  // initial state
  state: {
    templates: [],
    templateMode: false,
    settings: {
      siteName: 'SITE NAME',
      pages: true,
      pageFragments: true,
      templateMode: false,
      templates: []
    }
  },

  // mutations
  mutations: {
    [STORE_SETTING] (state, configEntry) {
      state.settings = { ...state.settings, ...configEntry }
    }
  },

  getters: {
    settings: state => {
      return state.settings
    },

    siteName: state => {
      return state.settings.siteName
    }
  }
}
