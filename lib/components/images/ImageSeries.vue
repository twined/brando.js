<template>
  <div class="card-wrapper mb-4">
    <ModalImageUpload
      :showModal="selectedImageSeriesForUpload === imageSeries.id"
      :imageSeries="imageSeries"
      :uploadCallback="uploadCallback"
      @close="closeUploadModal"
    />
    <ModalSortImageSeries
      :showModal="selectedImageSeriesForSorting === imageSeries.id"
      :imageSeries="imageSeries"
      :sequenceCallback="sequenceCallback"
      @close="closeImageSeriesSortModal"
    />
    <div class="card-header-tab">
      <b-dropdown variant="white" no-caret>
        <template slot="button-content">
          <i class="k-dropdown-icon"></i>
        </template>
        <button @click.prevent="uploadToSeries(imageSeries)" class="dropdown-item">
          <i class="fal fa-fw mr-3 subtle fa-cloud"></i>
          Last opp bilder til denne bildeserien
        </button>
        <button @click.prevent="sortSeries(imageSeries)" class="dropdown-item">
          <i class="fal fa-fw mr-3 subtle fa-sort-amount-down"></i>
          Sortér bilder i serien
        </button>
        <button class="dropdown-item">
          <i class="fal fa-fw mr-3 subtle fa-cog"></i>
          Konfigurér bildeserie
        </button>
        <button @click.prevent="deleteSeries(imageSeries)" class="dropdown-item">
          <i class="fal fa-fw mr-3 subtle fa-trash"></i>
          Slett bildeserie
        </button>
      </b-dropdown>
      <h5>{{ imageSeries.name }}</h5>
    </div>
    <div class="card">
      <div class="card-body" v-if="images.length">
        <transition-group name="fade-move">
          <template v-for="i in images">
            <BaseImage :image="i" :key="i.id" :selectedImages="selectedImages" />
          </template>
        </transition-group>
      </div>
      <div class="card-body" v-else>
        Ingen bilder i bildeserien
      </div>

      <div class="card-footer bg-white pt-0" v-if="modal">
        <div class="w-50">
          <button @click.prevent="uploadToSeries(imageSeries)" class="btn btn-outline-secondary text-left">
            <i class="fal fa-fw mr-3 subtle fa-cloud"></i>
            Last opp bilder
          </button>
          <button @click.prevent="sortSeries(imageSeries)" class="btn btn-outline-secondary text-left">
            <i class="fal fa-fw mr-3 subtle fa-sort-amount-down"></i>
            Sortér bilder
          </button>
          <button @click.prevent="deleteSeries(imageSeries)" class="btn btn-outline-secondary text-left">
            <i class="fal fa-fw mr-3 subtle fa-trash"></i>
            Slett bildeserie
          </button>
          <button @click.prevent="$emit('close')" class="btn btn-outline-secondary text-left">
            <i class="fal fa-fw mr-3 subtle fa-window-close"></i>
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
import ModalSortImageSeries from './modals/ModalSortImageSeries.vue'
import { alertConfirm } from '../../utils/alerts'
import { imageAPI } from '../../api/image'

export default {
  components: {
    BaseImage,
    ModalImageUpload,
    ModalSortImageSeries
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

    sequenceCallback: {
      type: Function,
      default: null
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

  computed: {
    images () {
      return [...this.imageSeries.images].sort((a, b) => parseInt(a.sequence) - parseInt(b.sequence))
    }
  },

  data () {
    return {
      selectedImageSeriesForUpload: null,
      selectedImageSeriesForSorting: null
    }
  },

  methods: {
    uploadToSeries (series) {
      this.selectedImageSeriesForUpload = series.id
    },

    sortSeries (series) {
      this.selectedImageSeriesForSorting = series.id
    },

    closeUploadModal () {
      this.selectedImageSeriesForUpload = null
    },

    closeImageSeriesSortModal () {
      this.selectedImageSeriesForSorting = null
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

<style lang="css">
</style>
