<template>
  <transition name="fade" appear>
    <div class="container">
      <spinner v-if="loading" />
      <div class="card mt-5" v-if="!loading">
        <div class="card-header">
          <h5 class="section mb-0">
            Konfigurer bildeserie
          </h5>
        </div>
        <div class="card-body">
          <ImageConfigForm :config="config" @save="save" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ImageConfigForm from '../../components/images/ImageConfigForm.vue'
// import { alertConfirm } from '../../utils/alerts'

export default {
  components: {
    ImageConfigForm
  },

  data () {
    return {
      loading: 0,
      config: {}
    }
  },

  inject: [
    'adminChannel'
  ],

  props: {
    seriesId: {
      required: true,
      type: String
    }
  },

  async created () {
    this.loading++
    this.adminChannel.channel
      .push('images:get_series_config', { series_id: this.seriesId })
      .receive('ok', payload => {
        this.config = payload.config
        this.loading--
      })
  },

  computed: {
    ...mapGetters('images', [
      'currentImageCategory'
    ])
  },

  methods: {
    save (config) {
      this.$toast.success({message: 'Lagrer konfigurasjon. Dette kan ta litt tid.'})
      this.adminChannel.channel
        .push('images:update_series_config', {series_id: this.seriesId, config: config})
        .receive('ok', payload => {
          this.$toast.success({message: 'Konfigurasjon oppdatert'})
          this.$router.push({ name: 'image-category-detail', params: { categoryId: this.currentImageCategory.id } })
        })
    },

    ...mapActions('images', [
      'fetchImageCategory'
    ])
  }
}
</script>
