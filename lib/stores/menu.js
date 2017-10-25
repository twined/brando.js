// import {
//   STORE_ME,
//   STORE_NOTIFICATIONS,
//   ADD_NOTIFICATION,
//   CLEAR_NOTIFICATIONS,
//   SET_NOTIFICATION_READ,
//   SET_SUPERUSER_ACTIVATED,
//   STORE_LOBBY_PRESENCES
// } from '@/store/mutation-types'
export const menu = {
  namespaced: true,
  // initial state
  state: {
    entries: [
      {
        text: 'Heading',
        icon: 'fa-user',
        children: [
          {
            text: 'Child 1',
            to: { name: 'company-overview' }
          }
        ]
      }
    ]
  },

  // mutations
  mutations: {
    // [STORE_ME] (state, user) {
    //   state.me = user
    // },
    //
    // [STORE_LOBBY_PRESENCES] (state, lobbyPresences) {
    //   state.lobbyPresences = lobbyPresences
    // },
    //
    // [STORE_NOTIFICATIONS] (state, notifications) {
    //   state.notifications = notifications
    // },
    //
    // [ADD_NOTIFICATION] (state, notification) {
    //   let newNotifications = [...state.notifications]
    //   newNotifications.unshift(notification)
    //   state.notifications = newNotifications
    // },
    //
    // [SET_NOTIFICATION_READ] (state, notificationId) {
    //   let notification = state.notifications.find(n => n.id === notificationId)
    //   let notifications = clone(state.notifications)
    //   let idx = state.notifications.indexOf(notification)
    //   let newNotification = clone(notification)
    //   newNotification.read = true
    //   notifications.splice(idx, 1)
    //   notifications.splice(idx, 0, newNotification)
    //   state.notifications = notifications
    // },
    //
    // [CLEAR_NOTIFICATIONS] (state) {
    //   let newNotifications = []
    //   state.notifications.forEach(n => {
    //     let newN = {...n, read: true}
    //     newNotifications.push(newN)
    //   })
    //   state.notifications = newNotifications
    // },
    //
    // [SET_SUPERUSER_ACTIVATED] (state, val) {
    //   let me = Object.assign({}, state.me)
    //   me.superuser_activated = val
    //   state.me = me
    // }
  },

  getters: {
    entries: state => {
      return state.entries
    }
    //
    // notifications: state => {
    //   return state.notifications
    // },
    //
    // unreadNotifications: state => {
    //   if (!state.notifications) {
    //     return []
    //   }
    //   return state.notifications.filter(notification => !notification.read)
    // },
    //
    // lobbyPresences: state => {
    //   return state.lobbyPresences
    // }
  },

  actions: {
  //   async getMe (context) {
  //     const me = await userAPI.getMe()
  //     context.commit(STORE_ME, me)
  //     return me
  //   },
  //
  //   async getNotifications (context) {
  //     const notifications = await userAPI.getNotifications()
  //     context.commit(STORE_NOTIFICATIONS, notifications || [])
  //     return notifications
  //   },
  //
  //   clearNotifications (context) {
  //     context.commit(CLEAR_NOTIFICATIONS)
  //   },
  //
  //   addNotification (context, notification) {
  //     context.commit(ADD_NOTIFICATION, notification)
  //   },
  //
  //   markNotificationRead (context, id) {
  //     context.commit(SET_NOTIFICATION_READ, id)
  //   },
  //
  //   setSuperuser (context, val) {
  //     context.commit(SET_SUPERUSER_ACTIVATED, val)
  //   },
  //
  //   storeLobbyPresences (context, state) {
  //     let lobbyPresences = Presence.syncState(context.state.lobbyPresences, state)
  //     context.commit(STORE_LOBBY_PRESENCES, lobbyPresences)
  //   },
  //
  //   storeLobbyPresencesDiff (context, diff) {
  //     let lobbyPresences = Presence.syncDiff(context.state.lobbyPresences, diff)
  //     context.commit(STORE_LOBBY_PRESENCES, lobbyPresences)
  //   }
  }
}
