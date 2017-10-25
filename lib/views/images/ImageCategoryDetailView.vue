<template>
  <transition name="fade" appear>
    <spinner v-if="loading" />
    <div class="image-category-detail" v-if="!loading">
      <ImageSelection :selectedImages="selectedImages" />
      <div class="row">
        <div class="col-md-12">
          <h1 class="wide text-center">{{ currentImageCategory.name }}</h1>
          <ModalCreateImageSeries
            :imageCategory="currentImageCategory"
            :showModal="showModalImageCreateSeries"
            @close="closeCreateImageSeriesModal"
          />
          <ModalCreateImageCategory
            :showModal="showModalImageCreateCategory"
            @close="closeCreateImageCategoryModal"
          />
          <div class="centered-link-list mb-5">
            <b-dropdown variant="trans btn-lg">
              <button @click.prevent="createImageCategory" class="dropdown-item">
                <i class="fal fa-fw mr-3 subtle fa-plus-circle"></i>
                Opprett ny bildekategori
              </button>
              <button @click.prevent="createImageSeries" class="dropdown-item">
                <i class="fal fa-fw mr-3 subtle fa-plus"></i>
                Opprett ny bildeserie
              </button>
              <button class="dropdown-item">
                <i class="fal fa-fw mr-3 subtle fa-sort-amount-down"></i>
                Sortér bildeserier i kategorien
              </button>
              <button class="dropdown-item">
                <i class="fal fa-fw mr-3 subtle fa-cog"></i>
                Konfigurér bildekategori
              </button>
              <button @click.prevent="deleteCategory" class="dropdown-item">
                <i class="fal fa-fw mr-3 subtle fa-trash"></i>
                Slett bildekategori
              </button>
            </b-dropdown>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <transition-group name="fade">
            <div class="card-wrapper mb-4" v-for="s in currentImageCategory.image_series" :key="s.id">
              <ModalImageUpload
                :showModal="selectedImageSeriesForUpload === s.id"
                :imageSeries="s"
                @close="closeUploadModal"
              />
              <ModalSortImageSeries
                :showModal="selectedImageSeriesForSorting === s.id"
                :imageSeries="s"
                @close="closeImageSeriesSortModal"
              />
              <div class="card-header-tab">
                <b-dropdown variant="trans">
                  <button @click.prevent="uploadToSeries(s)" class="dropdown-item">
                    <i class="fal fa-fw mr-3 subtle fa-cloud"></i>
                    Last opp bilder til denne bildeserien
                  </button>
                  <button @click.prevent="sortSeries(s)" class="dropdown-item">
                    <i class="fal fa-fw mr-3 subtle fa-sort-amount-down"></i>
                    Sortér bilder i serien
                  </button>
                  <button class="dropdown-item">
                    <i class="fal fa-fw mr-3 subtle fa-cog"></i>
                    Konfigurér bildeserie
                  </button>
                  <button @click.prevent="deleteSeries(s)" class="dropdown-item">
                    <i class="fal fa-fw mr-3 subtle fa-trash"></i>
                    Slett bildeserie
                  </button>
                </b-dropdown>
                <h5>{{ s.name }}</h5>
              </div>
              <div class="card">
                <div class="card-body" v-if="s.images.length">
                  <transition-group name="fade">
                    <template v-for="i in s.images">
                      <BaseImage :image="i" :key="i.id" :selectedImages="selectedImages" />
                    </template>
                  </transition-group>
                </div>
                <div class="card-body" v-else>
                  Ingen bilder i bildeserien
                </div>
              </div>
            </div>
          </transition-group>
          <div v-if="currentImageCategory.image_series.length">
            <button @click.prevent="previousPage" class="btn btn-outline-secondary">&larr; Forrige side</button>
            <button @click.prevent="nextPage" class="btn btn-outline-secondary">Neste side &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import imagesLoaded from 'vue-images-loaded'
import nprogress from 'nprogress'
import { alertConfirm } from '../../utils/alerts'

import BaseImage from '../../components/images/BaseImage'
import ImageSelection from '../../components/images/ImageSelection'
import ModalImageUpload from '../../components/images/modals/ModalImageUpload'
import ModalCreateImageSeries from '../../components/images/modals/ModalCreateImageSeries'
import ModalCreateImageCategory from '../../components/images/modals/ModalCreateImageCategory'
import ModalSortImageSeries from '../../components/images/modals/ModalSortImageSeries'

export default {
  components: {
    BaseImage,
    ImageSelection,
    ModalCreateImageSeries,
    ModalCreateImageCategory,
    ModalImageUpload,
    ModalSortImageSeries
  },

  data () {
    return {
      showModalImageCreateSeries: false,
      showModalImageCreateCategory: false,
      selectedImageSeriesForUpload: null,
      selectedImageSeriesForSorting: null,
      selectedImages: [],
      loading: 0,
      queryVars: {
        imageSeriesOffset: 0,
        imageSeriesLimit: 20
      }
    }
  },

  directives: {
    imagesLoaded
  },

  props: {
    categoryId: {
      required: false,
      type: String,
      default: ''
    }
  },

  created () {
    this.getData()
  },

  computed: {
    ...mapGetters('images', [
      'currentImageCategory'
    ])
  },

  methods: {
    createImageSeries () {
      this.showModalImageCreateSeries = true
    },

    createImageCategory () {
      this.showModalImageCreateCategory = true
    },

    uploadToSeries (series) {
      this.selectedImageSeriesForUpload = series.id
    },

    sortSeries (series) {
      this.selectedImageSeriesForSorting = series.id
    },

    closeUploadModal () {
      this.selectedImageSeriesForUpload = null
    },

    closeCreateImageSeriesModal () {
      this.showModalImageCreateSeries = false
    },

    closeCreateImageCategoryModal () {
      this.showModalImageCreateCategory = false
    },

    closeImageSeriesSortModal () {
      this.selectedImageSeriesForSorting = null
    },

    async getData () {
      this.loading++
      nprogress.start()
      await this.fetchImageCategory({categoryId: this.categoryId, queryVars: this.queryVars})
      this.loading--
      nprogress.done()
    },

    deleteCategory () {
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne bildekategorien?', (data) => {
        if (!data) {
          return
        }

        this.deleteImageCategory(this.currentImageCategory)
      })
    },

    deleteSeries (series) {
      alertConfirm('OBS', 'Er du sikker på at du vil slette denne bildeserien?', (data) => {
        if (!data) {
          return
        }

        this.deleteImageSeries(series)
      })
    },

    nextPage () {
      this.queryVars.imageSeriesOffset = this.queryVars.imageSeriesOffset + this.queryVars.imageSeriesLimit
      this.getData()
    },

    previousPage () {
      if (this.queryVars.imageSeriesOffset >= this.queryVars.imageSeriesLimit) {
        this.queryVars.imageSeriesOffset = this.queryVars.imageSeriesOffset - this.queryVars.imageSeriesLimit
        this.getData()
      }
    },

    ...mapActions('images', [
      'fetchImageCategory',
      'deleteImageSeries',
      'deleteImageCategory'
    ])
  }
}
</script>

<style lang="css">
</style>
