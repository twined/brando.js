import { nprogress } from 'kurtz'
import { organizationAPI } from '../../api/organization'

const STORE_ORGANIZATION = 'STORE_ORGANIZATION'
const STORE_ORGANIZATIONS = 'STORE_ORGANIZATIONS'
const DELETE_ORGANIZATION = 'DELETE_ORGANIZATION'

export const organizations = {
  namespaced: true,
  // initial state
  state: {
    organization: {},
    organizations: []
  },

  // mutations
  mutations: {
    [DELETE_ORGANIZATION] (state, organization) {
      const pIdx = state.organizations.indexOf(organization)

      state.organizations = [
        ...state.organizations.slice(0, pIdx),
        ...state.organizations.slice(pIdx + 1)
      ]
    },

    [STORE_ORGANIZATION] (state, organization) {
      state.organization = organization
    },

    [STORE_ORGANIZATIONS] (state, organizations) {
      state.organizations = organizations
    }
  },

  getters: {
    allOrganizations: state => {
      return state.organizations
    }
  },

  actions: {
    async getOrganizations (context, variables) {
      nprogress.start()
      const organizations = await organizationAPI.getOrganizations(variables)
      context.commit(STORE_ORGANIZATIONS, organizations)
      nprogress.done()
      return organizations
    },

    async getOrganization (context, organizationId) {
      nprogress.start()
      const organization = await organizationAPI.getOrganization(organizationId)
      context.commit(STORE_ORGANIZATION, organization)
      nprogress.done()
      return organization
    },

    async deleteOrganization (context, organization) {
      nprogress.start()
      await organizationAPI.deleteOrganization(organization.id)
      context.commit(DELETE_ORGANIZATION, organization)
      nprogress.done()
      return organization
    }
  }
}
