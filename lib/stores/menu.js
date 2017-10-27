import {
  STORE_MENU
} from './mutation-types'

export const menu = {
  namespaced: true,
  // initial state
  state: {
    entries: []
  },

  // mutations
  mutations: {
    [STORE_MENU] (state, entry) {
      state.entries = [].concat(...state.entries, entry)
    }
  },

  getters: {
    entries: state => {
      return state.entries
    }
  }
}
