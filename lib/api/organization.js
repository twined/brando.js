import apollo from 'kurtz/lib/api/apolloClient'
import { handleErr } from 'kurtz/lib/api/errorHandler.js'
// import { pick } from 'kurtz/lib/utils'

import ORGANIZATION_QUERY from './graphql/organizations/ORGANIZATION_QUERY.graphql'
import UPDATE_ORGANIZATION_MUTATION from './graphql/organizations/UPDATE_ORGANIZATION_MUTATION.graphql'
import DELETE_ORGANIZATION_MUTATION from './graphql/organizations/DELETE_ORGANIZATION_MUTATION.graphql'

const organizationAPI = {
  /**
   * getOrganization - get single organization
   *
   * @return {Object}
   */
  async getOrganization () {
    try {
      const result = await apollo.client.query({
        query: ORGANIZATION_QUERY,
        fetchPolicy: 'no-cache'
      })
      return result.data.organization
    } catch (err) {
      handleErr(err)
    }
  },

  /**
   * updateOrganization - Mutation for updating organization
   *
   * @param {Object} organizationParams
   * @return {Object}
   */
  async updateOrganization (organizationParams) {
    try {
      const result = await apollo.client.mutate({
        mutation: UPDATE_ORGANIZATION_MUTATION,
        variables: {
          organizationParams
        },
        fetchPolicy: 'no-cache'
      })
      return result.data.updateOrganization
    } catch (err) {
      handleErr(err)
    }
  },

  /**
   * deleteOrganization
   *
   * @param {Number} organizationId
   * @return {Object}
   */
  async deleteOrganization (organizationId) {
    try {
      const result = await apollo.client.mutate({
        mutation: DELETE_ORGANIZATION_MUTATION,
        variables: {
          organizationId
        },
        fetchPolicy: 'no-cache'
      })
      return result.data.deleteOrganization
    } catch (err) {
      handleErr(err)
    }
  }
}

export {
  organizationAPI
}
