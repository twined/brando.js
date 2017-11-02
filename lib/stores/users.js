import nprogress from 'nprogress'
import {
  STORE_ME,
  STORE_USER,
  STORE_USERS,
  UPDATE_USER,
  STORE_TOKEN,
  REMOVE_TOKEN
} from './mutation-types'

import { userAPI } from '../api/user'

// import { Presence } from 'phoenix'

export const users = {
  namespaced: true,
  // initial state
  state: {
    token: null,
    me: {},
    users: []
  },

  // mutations
  mutations: {
    [STORE_ME] (state, user) {
      state.me = user
    },

    [STORE_USERS] (state, users) {
      state.users = users
    },

    [STORE_USER] (state, user) {
      state.users = [...state.users, user]
    },

    [UPDATE_USER] (state, user) {
      const idx = state.users.indexOf(state.users.find(u => u.id === user.id))
      state.users = [
        ...state.users.slice(0, idx),
        user,
        ...state.users.slice(idx + 1)
      ]
    },

    [STORE_TOKEN] (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },

    [REMOVE_TOKEN] (state) {
      state.token = null
      localStorage.removeItem('token')
    }
  },

  getters: {
    me: state => {
      return state.me
    },

    allUsers: state => {
      return state.users
    },

    token: state => {
      return state.token
    }
  },

  actions: {
    storeToken (context, token) {
      context.commit(STORE_TOKEN, token)
    },

    async storeMe (context) {
      nprogress.start()
      const me = await userAPI.getMe()
      context.commit(STORE_ME, me)
      nprogress.done()
      return me
    },

    async storeUsers (context) {
      nprogress.start()
      const users = await userAPI.getUsers()
      context.commit(STORE_USERS, users)
      nprogress.done()
      return users
    },

    async storeUser (context, userParams) {
      nprogress.start()
      const user = await userAPI.createUser(userParams)
      context.commit(STORE_USER, user)
      nprogress.done()
      return user
    },

    async updateUser (context, user) {
      nprogress.start()
      const updatedUser = await userAPI.updateUser(user.id, user)
      context.commit(UPDATE_USER, updatedUser)
      nprogress.done()
      return updatedUser
    }
  }
}
