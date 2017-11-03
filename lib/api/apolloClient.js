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
