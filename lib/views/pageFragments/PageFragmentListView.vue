<template>
  <div class="pages container" v-if="!loading" appear>
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
                <router-link :to="{ name: 'pagefragment-create' }" class="btn btn-secondary" exact>
                  Nytt sidefragment
                </router-link>
              </p>
            </div>
            <div class="page-list">
              <table class="table table-airy">
                <tbody name="slide-fade-top-slow" is="transition-group">
                  <tr v-for="page in allPageFragments" :key="page.id">
                    <td class="fit">
                      <i class="fa fa-fw fa-angle-right"></i>
                    </td>
                    <td class="fit">
                      <Flag :value="page.language" />
                    </td>
                    <td class="text-mono text-sm text-left">
                      {{ page.parent_key}} /
                      <router-link :to="{ name: 'pagefragment-edit', params: { pageId: page.id } }" exact>
                        {{ page.key }}
                      </router-link>
                    </td>
                    <td class="text-xs fit">
                      {{ page.updated_at | datetime }}
                    </td>
                    <td class="fit">
                      <b-dropdown variant="white" no-caret>
                        <template slot="button-content">
                          <i class="k-dropdown-icon"></i>
                        </template>
                        <router-link
                          :to="{ name: 'pagefragment-edit', params: { pageId: page.id } }"
                          tag="button"
                          :class="{'dropdown-item': true}"
                          exact
                        >
                          <i class="fal fa-pencil fa-fw mr-2"></i>
                          Endre page
                        </router-link>
                        <button
                          @click.prevent="deletePageFragment(page)"
                          :class="{'dropdown-item': true}"
                        >
                          <i class="fal fa-trash fa-fw mr-2"></i>
                          Slett page
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

  created () {
    console.log('created <PageFragmentListView />')
    this.getData()
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

  methods: {
    async getData () {
      this.loading++
      await this.getPageFragments()
      this.loading--
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
