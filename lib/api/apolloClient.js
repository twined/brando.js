import ApolloClient from 'apollo-client'
import { createNetworkInterface } from 'apollo-absinthe-upload-client'

const GQL_URI = '/admin/graphql'

class KurtzApolloClient {
  async initialize () {
    const networkInterface = createNetworkInterface({
      uri: GQL_URI,
      dataIdFromObject: o => o.id
    })

    networkInterface.use([{
      async applyMiddleware (req, next) {
        if (!req.options.headers) {
          req.options.headers = {} // Create the header object if needed.
        }
        // get the authentication token from local storage if it exists
        this.token = await localStorage.getItem('token')
        req.options.headers.authorization = this.token ? `Bearer ${this.token}` : null
        next()
      }
    }])

    this.client = new ApolloClient({networkInterface})
  }
}

const apolloClient = new KurtzApolloClient()

export default apolloClient

// console.log('= apolloClient: getting token')
// const token = localStorage.getItem('token')
// console.log(token)
//
// let networkInterface
//
// networkInterface = createNetworkInterface({
//   uri: '/admin/graphql',
//   opts: {
//     credentials: 'include',
//     headers: {
//       authorization: token ? `Bearer ${token}` : null
//     }
//   }
// })
//
// networkInterface.useAfter([{
//   applyAfterware ({ response }, next) {
//     if (response.status === 406) {
//       console.log('406 from backend')
//       // localStorage.removeItem('token')
//       // window.location = '/admin/login'
//     }
//     next()
//   }
// }])
//
// export default new ApolloClient({
//   networkInterface,
//   transportBatching: true,
//   queryDeduplication: true,
//   dataIdFromObject: (result) => {
//     if (result.id && result.__typename) {
//       return result.__typename + '__' + result.id
//     }
//
//     // Make sure to return null if this object doesn't have an ID
//     return null
//   }
// })
