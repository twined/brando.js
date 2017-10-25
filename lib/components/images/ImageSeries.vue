<template>
  <div class="card-wrapper mb-4">
    <ModalImageUpload
      :showModal="selectedImageSeriesForUpload === imageSeries.id"
      :imageSeries="imageSeries"
      @close="closeUploadModal"
    />
    <ModalSortImageSeries
      :showModal="selectedImageSeriesForSorting === imageSeries.id"
      :imageSeries="imageSeries"
      @close="closeImageSeriesSortModal"
    />
    <div class="card-header-tab">
      <b-dropdown variant="trans">
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
    </div>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import BaseImage from './BaseImage'
import ModalImageUpload from './modals/ModalImageUpload'
import ModalSortImageSeries from './modals/ModalSortImageSeries'
import { alertConfirm } from '../../utils/alerts'

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
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne bildeserien?', (data) => {
        if (!data) {
          return
        }

        this.deleteImageSeries(series)
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
