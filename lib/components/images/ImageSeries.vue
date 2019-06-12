<template>
  <div class="card-wrapper mb-4">
    <ModalImageUpload
      :show-modal="selectedImageSeriesForUpload === imageSeries.id"
      :image-series="imageSeries"
      :upload-callback="uploadCallback"
      @close="closeUploadModal" />
    <div class="card-header-tab">
      <b-dropdown
        variant="white"
        no-caret>
        <template slot="button-content">
          <i class="k-dropdown-icon" />
        </template>
        <button
          class="dropdown-item"
          @click.prevent="uploadToSeries(imageSeries)">
          <i class="fal fa-fw mr-3 subtle fa-cloud" />
          Last opp bilder til denne bildeserien
        </button>
        <router-link
          :to="{ name: 'image-series-config', params: { seriesId: imageSeries.id } }"
          tag="button"
          class="dropdown-item">
          <i class="fal fa-fw mr-3 subtle fa-cog" />
          Konfigurér bildeserie
        </router-link>
        <button
          class="dropdown-item"
          @click.prevent="deleteSeries(imageSeries)">
          <i class="fal fa-fw mr-3 subtle fa-trash" />
          Slett bildeserie
        </button>
      </b-dropdown>
      <h5>{{ imageSeries.name }}</h5>
    </div>
    <div class="card">
      <div
        v-if="images.length"
        class="card-body">
        <transition-group
          v-sortable="{handle: '.sort-handle', animation: 0, store: {get: getOrder, set: storeOrder}}"
          name="fade-move"
          tag="div"
          class="sort-container">
          <template v-for="i in images">
            <BaseImage
              :key="i.id"
              :data-id="i.id"
              class="sort-handle"
              :image="i"
              :selected-images="selectedImages" />
          </template>
        </transition-group>
      </div>
      <div
        v-else
        class="card-body">
        Ingen bilder i bildeserien
      </div>

      <div
        v-if="modal"
        class="card-footer bg-white pt-0">
        <div class="w-50">
          <button
            class="btn btn-outline-secondary text-left"
            @click.prevent="uploadToSeries(imageSeries)">
            <i class="fal fa-fw mr-3 subtle fa-cloud" />
            Last opp bilder
          </button>
          <button
            class="btn btn-outline-secondary text-left"
            @click.prevent="deleteSeries(imageSeries)">
            <i class="fal fa-fw mr-3 subtle fa-trash" />
            Slett bildeserie
          </button>
          <button
            class="btn btn-outline-secondary text-left"
            @click.prevent="$emit('close')">
            <i class="fal fa-fw mr-3 subtle fa-window-close" />
            Lukk vindu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import BaseImage from './BaseImage.vue'
import ModalImageUpload from './modals/ModalImageUpload.vue'
import { alertConfirm } from '../../utils/alerts'
import { imageAPI } from '../../api/image'

export default {
  components: {
    BaseImage,
    ModalImageUpload
  },

  props: {
    imageSeries: {
      required: true,
      type: Object
    },

    selectedImages: {
      required: true,
      type: Array
    },

    uploadCallback: {
      type: Function,
      default: null
    },

    deleteCallback: {
      type: Function,
      default: null
    },

    /**
     * If true, will show buttons at bottom of series
     */
    modal: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      sortedArray: [],
      selectedImageSeriesForUpload: null
    }
  },

  computed: {
    images () {
      return this.imageSeries.images
    }
  },

  inject: [
    'adminChannel'
  ],

  methods: {
    getOrder (sortable) {
      return this.images
    },

    storeOrder (sortable) {
      this.sortedArray = sortable.toArray()

      this.adminChannel.channel
        .push('images:sequence_images', { ids: this.sortedArray })
        .receive('ok', payload => {
          this.$toast.success({ message: 'Rekkefølge oppdatert' })
        })
    },

    uploadToSeries (series) {
      this.selectedImageSeriesForUpload = series.id
    },

    closeUploadModal () {
      this.selectedImageSeriesForUpload = null
    },

    deleteSeries (series) {
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne bildeserien?', async (data) => {
        if (!data) {
          return
        }
        if (this.deleteCallback) {
          await imageAPI.deleteImageSeries(series.id)
          this.deleteCallback(series)
        } else {
          this.deleteImageSeries(series)
        }
      })
    },

    ...mapActions('images', [
      'deleteImageSeries'
    ])
  }
}
</script>
