<template>
  <div
    v-if="!loading"
    class="pages container"
    appear>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="section mb-0">Sidefragmenter</h5>
          </div>
          <div class="card-body">
            <div class="jumbotron text-center">
              <h1 class="display-1 text-uppercase text-strong">Sidefragmenter</h1>
              <p class="lead">Sidefragmenter er små dynamiske biter av nettsiden som kan tilpasses og endres</p>
              <hr class="my-4">
              <p class="lead">
                <router-link
                  :to="{ name: 'pagefragment-create' }"
                  class="btn btn-secondary"
                  exact>
                  Nytt sidefragment
                </router-link>
              </p>
            </div>
            <div class="page-list">
              <table class="table table-airy">
                <tbody
                  is="transition-group"
                  name="slide-fade-top-slow">
                  <tr
                    v-for="page in allPageFragments"
                    :key="page.id">
                    <td class="fit">
                      <i class="fa fa-fw fa-angle-right"/>
                    </td>
                    <td class="fit">
                      <Flag :value="page.language" />
                    </td>
                    <td class="text-mono text-sm text-left">
                      {{ page.parent_key }} /
                      <router-link
                        :to="{ name: 'pagefragment-edit', params: { pageId: page.id } }"
                        exact>
                        {{ page.key }}
                      </router-link>
                    </td>
                    <td class="text-xs fit">
                      {{ page.updated_at | datetime }}
                    </td>
                    <td class="fit">
                      <b-dropdown
                        variant="white"
                        no-caret>
                        <template slot="button-content">
                          <i class="k-dropdown-icon"/>
                        </template>
                        <router-link
                          :to="{ name: 'pagefragment-edit', params: { pageId: page.id } }"
                          :class="{'dropdown-item': true}"
                          tag="button"
                          exact>
                          <i class="fal fa-pencil fa-fw mr-2"/>
                          Endre fragment
                        </router-link>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="duplicatePageFragment(page)">
                          <i class="fal fa-copy fa-fw mr-2"/>
                          Duplisér fragment
                        </button>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="deletePageFragment(page)">
                          <i class="fal fa-trash fa-fw mr-2"/>
                          Slett fragment
                        </button>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { alertConfirm } from 'kurtz/lib/utils/alerts'
import { pageFragmentAPI } from 'kurtz/lib/api/pageFragment'

export default {
  components: {

  },

  data () {
    return {
      loading: 0
    }
  },

  computed: {
    ...mapGetters('users', [
      'me'
    ]),
    ...mapGetters('pageFragments', [
      'allPageFragments'
    ])
  },

  inject: [
    'adminChannel'
  ],

  created () {
    console.log('created <PageFragmentListView />')
    this.getData()
  },

  methods: {
    async getData () {
      this.loading++
      await this.getPageFragments()
      this.loading--
    },

    async duplicatePageFragment (page) {
      this.adminChannel.channel
        .push('page_fragment:duplicate', { id: page.id })
        .receive('ok', payload => {
          this.$store.commit('pageFragments/ADD_PAGE_FRAGMENT', payload.page_fragment)
        })
    },

    deletePageFragment (page) {
      alertConfirm('OBS', 'Er du sikker på at du vil slette dette fragmentet?', async (data) => {
        if (!data) {
          return
        }

        await pageFragmentAPI.deletePageFragment(page.id)
        this.$store.commit('pageFragments/DELETE_PAGE_FRAGMENT', page.id)
      })
    },

    ...mapActions('pageFragments', [
      'getPageFragments'
    ])
  }
}
</script>
