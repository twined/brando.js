<template>
  <transition name="fade" appear>
    <div class="image-selection" v-if="selectedImages.length">
      <div class="container">
        <div class="float-right">
          <button class="btn btn-outline-secondary" @click.prevent="clearSelection">
            Avbryt
          </button>
          <button class="btn btn-secondary" @click.prevent="showConfirm = true">
            Slett <strong>{{ selectedImages.length }}</strong> <template v-if="selectedImages.length === 1">valgt bilde</template><template v-else>valgte bilder</template>
          </button>
        </div>
      </div>
      <modal
        :chrome="false"
        :large="true"
        :show="showConfirm"
        @cancel="showConfirm = false"
        @ok="showConfirm = false"
        v-if="showConfirm"
      >
        <div class="card mb-3">
          <div class="card-header text-center">
            <h5 class="section mb-0">Bekreft sletting</h5>
          </div>
          <div class="card-body">
            <div
              class="image-wrapper d-inline-block m-1"
              v-for="(i, idx) in selectedImages"
              :key="idx">
              <img :src="i.image.image.thumb" class="img-fluid" />
            </div>
            <div class="mt-3">
              <button @click.prevent="deleteImages" class="btn btn-secondary">
                Slett bilder
              </button>
              <button @click.prevent="showConfirm = false" class="btn btn-outline-secondary">
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </modal>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import Modal from '../Modal'

export default {
  components: {
    Modal
  },

  props: {
    selectedImages: {
      required: true,
      default: () => []
    }
  },

  inject: [
    'adminChannel'
  ],

  data () {
    return {
      showConfirm: false
    }
  },

  methods: {
    clearSelection () {
      while (this.selectedImages.length) {
        this.selectedImages[0].click()
      }
    },

    deleteImages () {
      this.adminChannel.channel
        .push('images:delete_images', { ids: this.selectedImages.map(i => i.image.id) })
        .receive('ok', payload => {
          for (let i of this.selectedImages) {
            const {id, image_series_id: imageSeriesId} = i.image
            this.deleteImage({id, imageSeriesId})
          }
          this.clearSelection()
          this.showConfirm = false
        })
    },
    ...mapActions('images', [
      'deleteImage'
    ])
  }
}
</script>
