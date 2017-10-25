<template>
  <modal
    :chrome="false"
    :show="showModal"
    :large="true"
    @cancel="closeModal"
    @ok="closeModal"
    v-if="showModal"
  >
    <div class="card mb-3">
      <div class="card-header text-center">
        <h5 class="section mb-0">Sortér bildeserie</h5>
      </div>
      <div class="card-body">
        <div
          class="sort-container"
          v-sortable="{handle: '.sort-handle', animation: 250, store: {get: getOrder, set: storeOrder}}"
          ref="sortable"
        >
          <div :data-id="i.id" class="sort-handle" v-for="i in imageSeries.images" :key="i.id">
            <img :src="i.image.thumb" />
          </div>
        </div>
        <div class="mt-4">
          <button @click.prevent="save" class="btn btn-secondary">
            Lagre rekkefølge
          </button>
          <button @click.prevent="closeModal" class="btn">
            Avbryt
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
// import { mapActions } from 'vuex'
import Modal from '../../Modal'
// import { showError } from '../../../utils'

export default {
  components: {
    Modal
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    imageSeries: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      sortedArray: []
    }
  },

  inject: [
    'adminChannel'
  ],

  methods: {
    async save () {
      this.adminChannel.channel
        .push('images:sort_image_series', { image_series_id: this.imageSeries.id, ids: this.sortedArray })
        .receive('ok', payload => {
          console.log(payload)
          this.$store.commit('DELETE_IMAGE_SERIES', this.imageSeries)
          this.$store.commit('ADD_IMAGE_SERIES', payload.imageSeries)
        })
      // try {
      //   const is = await this.createImageSeries({ ...this.series, image_category_id: this.imageCategory.id })
      //   console.log(is)
      //   // scroll to it?
      //   this.closeModal()
      // } catch (err) {
      //   showError(err)
      // }
    },

    closeModal () {
      this.$emit('close')
    },

    getOrder (sortable) {
      return this.imageSeries.images
    },

    storeOrder (sortable) {
      this.sortedArray = sortable.toArray()
    }

    // ...mapActions('images', [
    //   'createImageSeries'
    // ])
  }
}
</script>
