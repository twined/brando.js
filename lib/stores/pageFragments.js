import nprogress from 'nprogress'
import {
  STORE_PAGE_FRAGMENT,
  STORE_PAGE_FRAGMENTS,
  DELETE_PAGE_FRAGMENT
} from './mutation-types'

import { pageFragmentAPI } from '../api/pageFragment'

export const pageFragments = {
  namespaced: true,
  // initial state
  state: {
    pageFragments: []
  },

  // mutations
  mutations: {
    [DELETE_PAGE_FRAGMENT] (state, pageFragmentId) {
      const p = state.pageFragments.find(p => parseInt(p.id) === parseInt(pageFragmentId))
      const pIdx = state.pageFragments.indexOf(p)

      state.pageFragments = [
        ...state.pageFragments.slice(0, pIdx),
        ...state.pageFragments.slice(pIdx + 1)
      ]
    },

    [STORE_PAGE_FRAGMENT] (state, pageFragment) {
      state.pageFragment = pageFragment
    },

    [STORE_PAGE_FRAGMENTS] (state, pageFragments) {
      state.pageFragments = pageFragments
    }
  },

  getters: {
    allPageFragments: state => {
      return state.pageFragments
    }
  },

  actions: {
    async getPages (context, variables) {
      nprogress.start()
      const pageFragments = await pageFragmentAPI.getPages(variables)
      context.commit(STORE_PAGE_FRAGMENTS, pageFragments)
      nprogress.done()
      return pageFragments
    },

    async getPage (context, pageFragmentId) {
      nprogress.start()
      const pageFragment = await pageFragmentAPI.getPage(pageFragmentId)
      context.commit(STORE_PAGE_FRAGMENT, pageFragment)
      nprogress.done()
      return pageFragment
    }
  }
}
