import {
  STORE_SETTING
} from './mutation-types'

export const config = {
  namespaced: true,
  // initial state
  state: {
    settings: {
      siteName: 'SITE NAME'
    }
  },

  // mutations
  mutations: {
    [STORE_SETTING] (state, configEntry) {
      console.log('STORE SETTING!')
      state.settings = {...state.settings, ...configEntry}
      console.log(state.settings)
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
