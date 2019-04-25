<template>
  <div
    v-if="!loading"
    class="pages container"
    appear>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="section mb-0">
              Sider
            </h5>
          </div>
          <div class="card-body">
            <div class="jumbotron text-center">
              <h1 class="display-1 text-uppercase text-strong">
                Sider
              </h1>
              <p class="lead">
                Administrér sideinnhold og fragmenter
              </p>
              <hr class="my-4">
              <p class="lead">
                <router-link
                  :to="{ name: 'page-create' }"
                  class="btn btn-secondary"
                  exact>
                  Ny side
                </router-link>
                <br>
                <button
                  class="btn btn-danger mt-2"
                  @click.prevent="rerenderPages()">
                  (!) Reprosessér alle sider
                </button>
              </p>
            </div>
            <div class="page-list">
              <table class="table table-airy">
                <tbody
                  is="transition-group"
                  v-for="page in allPages"
                  :key="page.id"
                  name="slide-fade-top-slow">
                  <tr :key="page.id">
                    <td class="fit">
                      <i class="fa fa-fw fa-angle-right" />
                    </td>
                    <td class="fit">
                      <Flag :value="page.language" />
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
                      <b-dropdown
                        variant="white"
                        no-caret>
                        <template slot="button-content">
                          <i class="k-dropdown-icon" />
                        </template>
                        <router-link
                          :to="{ name: 'page-edit', params: { pageId: page.id } }"
                          :class="{'dropdown-item': true}"
                          tag="button"
                          exact>
                          <i class="fal fa-pencil fa-fw mr-2" />
                          Endre side
                        </router-link>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="rerenderPage(page)">
                          <i class="fal fa-sync fa-fw mr-2" />
                          Reprosessér side
                        </button>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="duplicatePage(page)">
                          <i class="fal fa-copy fa-fw mr-2" />
                          Duplisér side
                        </button>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="deletePage(page)">
                          <i class="fal fa-trash fa-fw mr-2" />
                          Slett side
                        </button>
                      </b-dropdown>
                    </td>
                  </tr>
                  <tr
                    v-for="subpage in page.children"
                    :key="subpage.id"
                    class="page-subrow">
                    <td class="">
                      <i class="fa fa-fw fa-angle-double-right" />
                    </td>
                    <td class="fit">
                      <Flag :value="subpage.language" />
                    </td>
                    <td class="text-mono text-sm text-left fit">
                      {{ page.key }} / {{ subpage.key }}
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
                      <b-dropdown
                        variant="white"
                        no-caret>
                        <template slot="button-content">
                          <i class="k-dropdown-icon" />
                        </template>
                        <router-link
                          :to="{ name: 'page-edit', params: { subpageId: subpage.id } }"
                          :class="{'dropdown-item': true}"
                          tag="button"
                          exact>
                          <i class="fal fa-pencil fa-fw mr-2" />
                          Endre subpage
                        </router-link>
                        <button
                          :class="{'dropdown-item': true}"
                          @click.prevent="deletePage(subpage)">
                          <i class="fal fa-trash fa-fw mr-2" />
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

  created () {
    console.log('created <PageListView />')
    this.getData()
  },

  methods: {
    async getData () {
      this.loading++
      await this.getPages()
      this.loading--
    },

    async duplicatePage (page) {
      this.adminChannel.channel
        .push('page:duplicate', { id: page.id })
        .receive('ok', payload => {
          this.$store.commit('pages/ADD_PAGE', payload.page)
        })
    },

    rerenderPage (page) {
      this.adminChannel.channel
        .push('page:rerender', { id: page.id })
        .receive('ok', payload => {
          this.$toast.success({ message: 'Siden ble gjengitt på nytt' })
        })
    },

    rerenderPages () {
      alertConfirm('OBS', 'Er du sikker på at du vil gjengi ALLE sider på nytt?', async (data) => {
        if (!data) {
          return
        }
        this.adminChannel.channel
          .push('page:rerender_all')
          .receive('ok', payload => {
            this.$toast.success({ message: 'Sidene ble gjengitt på nytt' })
          })
      })
    },

    deletePage (page) {
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne siden?', (data) => {
        if (!data) {
          return
        }

        this.adminChannel.channel
          .push('page:delete', { id: page.id })
          .receive('ok', payload => {
            this.$store.commit('pages/DELETE_PAGE', page.id)
          })
      })
    },

    ...mapActions('pages', [
      'getPages'
    ])
  }
}
</script>
