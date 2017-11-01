<template>
  <transition name="fade" appear>
    <spinner v-if="loading" />
    <div class="image-category-detail" v-if="!loading">
      <ImageSelection
        :selectedImages="selectedImages"
      />
      <div class="row">
        <div class="col-md-12">
          <h1 class="wide text-center">{{ currentImageCategory.name }}</h1>
          <ModalCreateImageSeries
            :imageCategory="currentImageCategory"
            @close="closeCreateImageSeriesModal"
            v-if="showModalImageCreateSeries"
          />
          <ModalCreateImageCategory
            :showModal="showModalImageCreateCategory"
            @close="closeCreateImageCategoryModal"
          />
          <div class="centered-link-list mb-5">
            <b-dropdown variant="white btn-lg" no-caret>
              <template slot="button-content">
                <i class="k-dropdown-icon"></i>
              </template>
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
            <ImageSeries
              :imageSeries="s"
              :selectedImages="selectedImages"
              v-for="s in currentImageCategory.image_series" :key="s.id"
            />
          </transition-group>
          <div v-if="currentImageCategory.image_series.length">
            <button
              v-if="queryVars.imageSeriesOffset !== 0"
              @click.prevent="previousPage"
              class="btn btn-outline-secondary">
              &larr; Forrige side
            </button>
            <button
              v-if="queryVars.imageSeriesOffset + queryVars.imageSeriesLimit < currentImageCategory.image_series_count"
              @click.prevent="nextPage"
              class="btn btn-outline-secondary">
              Neste side &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import nprogress from 'nprogress'
import { alertConfirm } from '../../utils/alerts'

import BaseImage from '../../components/images/BaseImage'
import ImageSeries from '../../components/images/ImageSeries'
import ImageSelection from '../../components/images/ImageSelection'
import ModalCreateImageSeries from '../../components/images/modals/ModalCreateImageSeries'
import ModalCreateImageCategory from '../../components/images/modals/ModalCreateImageCategory'

export default {
  components: {
    BaseImage,
    ImageSelection,
    ImageSeries,
    ModalCreateImageSeries,
    ModalCreateImageCategory
  },

  data () {
    return {
      showModalImageCreateSeries: false,
      showModalImageCreateCategory: false,
      selectedImages: [],
      loading: 0,
      queryVars: {
        imageSeriesOffset: 0,
        imageSeriesLimit: 20
      }
    }
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

    closeCreateImageSeriesModal () {
      this.showModalImageCreateSeries = false
    },

    closeCreateImageCategoryModal () {
      this.showModalImageCreateCategory = false
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
      'deleteImageCategory'
    ])
  }
}
</script>

<style lang="css">
</style>
