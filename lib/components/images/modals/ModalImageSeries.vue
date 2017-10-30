<template>
  <modal
    :chrome="false"
    :show="true"
    :large="true"
    @cancel="closeModal"
    @ok="closeModal"
    v-if="!loading"
  >
    <ImageSeries
      :imageSeries="imageSeries"
      :selectedImages="selectedImages"
      :sequenceCallback="sortCallback"
      :uploadCallback="uploadCallback"
      :deleteCallback="deleteCallback"
      :modal="true"
      @close="closeModal"
    />
  </modal>
</template>

<script>
import nprogress from 'nprogress'
import { imageAPI } from '../../../api/image'
import Modal from '../../Modal'
import ImageSeries from '../ImageSeries'

export default {
  components: {
    Modal,
    ImageSeries
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    imageSeriesId: {
      required: true
    },

    selectedImages: {
      type: Array,
      required: true
    }
  },

  created () {
    console.log('created <ModalImageSeries />')
    this.getData()
  },

  data () {
    return {
      loading: 0,
      imageSeries: {},
      sortedArray: []
    }
  },

  inject: [
    'adminChannel'
  ],

  methods: {
    async getData () {
      nprogress.start()
      this.loading++
      const imgSeries = await imageAPI.getImageSeries(this.imageSeriesId)
      this.imageSeries = {...imgSeries}
      this.loading--
      nprogress.done()
    },

    sortCallback ({ imageSeries, ids }) {
      console.log('my callback', ids, imageSeries)
      for (let i = 0; i < ids.length; i++) {
        let imageId = ids[i]
        const img = imageSeries.images.find(i => parseInt(i.id) === parseInt(imageId))
        const imgIdx = imageSeries.images.indexOf(img)
        imageSeries = {
          ...imageSeries,
          images: [
            ...imageSeries.images.slice(0, imgIdx),
            {...img, sequence: i},
            ...imageSeries.images.slice(imgIdx + 1)
          ]
        }
      }
      this.imageSeries = imageSeries
    },

    uploadCallback (image) {
      this.imageSeries.images = [...this.imageSeries.images, image]
    },

    deleteCallback (imageSeries) {
      this.closeModal()
      this.$emit('delete', imageSeries)
    },

    closeModal () {
      this.$emit('close')
    }
  }
}
</script>
