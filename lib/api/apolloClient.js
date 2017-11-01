import ApolloClient from 'apollo-client'
import { createNetworkInterface } from 'apollo-absinthe-upload-client'

const token = localStorage.getItem('token')

let networkInterface
let apolloClient

if (token) {
  networkInterface = createNetworkInterface({
    uri: '/admin/graphql',
    opts: {
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  })

  networkInterface.useAfter([{
    applyAfterware ({ response }, next) {
      if (response.status === 406) {
        localStorage.removeItem('token')
        window.location = '/admin/login?expired=true'
      }
      next()
    }
  }])

  apolloClient = new ApolloClient({
    networkInterface,
    transportBatching: true,
    queryDeduplication: true,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) {
        return result.__typename + '__' + result.id
      }

      // Make sure to return null if this object doesn't have an ID
      return null
    }
  })
} else {
  apolloClient = null
}

export default apolloClient
