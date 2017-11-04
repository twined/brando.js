<template>
  <div class="pages container" v-if="!loading" appear>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="section mb-0">Sider</h5>
          </div>
          <div class="card-body">
            <div class="jumbotron text-center">
              <h1 class="display-1 text-uppercase text-strong">Sider</h1>
              <p class="lead">Administrér sideinnhold og fragmenter</p>
              <hr class="my-4">
              <p class="lead">
                <router-link :to="{ name: 'page-create' }" class="btn btn-secondary" exact>
                  Ny side
                </router-link>
              </p>
            </div>
            <div class="page-list">
              <table class="table table-airy">
                <tbody name="slide-fade-top-slow" is="transition-group" v-for="page in allPages" :key="page.id">
                  <tr :key="page.id">
                    <td class="fit">
                      <i class="fa fa-fw fa-angle-right"></i>
                    </td>
                    <td class="text-mono text-sm text-left">
                      {{ page.key }}
                    </td>
                    <td class="text-sm text-strong">
                      <router-link
                        :to="{ name: 'page-edit', params: { pageId: page.id } }"
                        exact>
                        {{ page.title }}
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
                          :to="{ name: 'page-edit', params: { pageId: page.id } }"
                          tag="button"
                          :class="{'dropdown-item': true}"
                          exact
                        >
                          <i class="fal fa-pencil fa-fw mr-2"></i>
                          Endre page
                        </router-link>
                        <button
                          @click.prevent="deletePage(page)"
                          :class="{'dropdown-item': true}"
                        >
                          <i class="fal fa-trash fa-fw mr-2"></i>
                          Slett page
                        </button>
                      </b-dropdown>
                    </td>
                  </tr>
                  <tr v-for="subpage in page.children" :key="subpage.id" class="page-subrow">
                    <td class="">
                      <i class="fa fa-fw fa-angle-double-right"></i>
                    </td>
                    <td class="text-mono text-sm text-left">
                      {{ subpage.key }}
                    </td>
                    <td class="text-sm text-strong">
                      <router-link
                        :to="{ name: 'page-edit', params: { pageId: subpage.id } }"
                        exact>
                        {{ subpage.title }}
                      </router-link>
                    </td>
                    <td class="fit text-xs">
                      {{ subpage.updated_at | datetime }}
                    </td>
                    <td>
                      <b-dropdown variant="white" no-caret>
                        <template slot="button-content">
                          <i class="k-dropdown-icon"></i>
                        </template>
                        <router-link
                          :to="{ name: 'subpage-edit', params: { subpageId: subpage.id } }"
                          tag="button"
                          :class="{'dropdown-item': true}"
                          exact
                        >
                          <i class="fal fa-pencil fa-fw mr-2"></i>
                          Endre subpage
                        </router-link>
                        <button
                          @click.prevent="deletePage(subpage)"
                          :class="{'dropdown-item': true}"
                        >
                          <i class="fal fa-trash fa-fw mr-2"></i>
                          Slett subpage
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

export default {
  components: {

  },

  data () {
    return {
      loading: 0
    }
  },

  created () {
    console.log('created <PageListView />')
    this.getData()
  },

  computed: {
    ...mapGetters('users', [
      'me'
    ]),
    ...mapGetters('pages', [
      'allPages'
    ])
  },

  inject: [
    'adminChannel'
  ],

  methods: {
    async getData () {
      this.loading++
      await this.getPages()
      this.loading--
    },

    deletePage (page) {
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne pageen?', (data) => {
        if (!data) {
          return
        }

        this.adminChannel.channel
          .push('page:delete', { id: page.id })
          .receive('ok', payload => {
            this.$store.commit('pages/DELETE_POST', page.id)
          })
      })
    },

    ...mapActions('pages', [
      'getPages'
    ])
  }
}
</script>
