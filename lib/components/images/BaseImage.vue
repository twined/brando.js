<template>
  <div
    :class="{selected: this.selected}"
    class="image-wrapper d-inline-block m-1"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
    @click.prevent="click">
    <div @click.stop.prevent="editImage" class="overlay" v-show="showOverlay">
      <i class="fa fa-search fa-fw"></i>
    </div>
    <modal
      :chrome="false"
      :large="true"
      :show="showEdit"
      @cancel="closeEdit"
      @ok="closeEdit"
      v-if="showEdit"
    >
      <div class="card">
        <div class="card-header">
          Endre bildedetaljer
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <img :src="image.image.medium" class="img-fluid" />
            </div>
            <div class="col-6">
              <dt>
                Filnavn
              </dt>
              <dd>
                {{ image.image.path }}
              </dd>
              <dt>
                Dimensjoner
              </dt>
              <dd v-if="image.image.width && image.image.height">
                {{ image.image.width }}x{{ image.image.height }}
              </dd>
              <dd v-else>
                Ingen dimensjoner
              </dd>
              <dt>
                Optimalisert
              </dt>
              <dd>
                <CheckOrX :val="image.image.optimized" />
              </dd>
            </div>
          </div>
        </div>
      </div>
    </modal>

    <img :src="image.image.thumb" class="img-fluid" />
  </div>
</template>

<script>

import CheckOrX from '../CheckOrX'
import Modal from '../Modal'

export default {
  components: {
    CheckOrX,
    Modal
  },

  props: {
    image: {
      required: true,
      type: Object
    },

    selectedImages: {
      required: true,
      default: () => []
    }
  },

  data () {
    return {
      selected: false,
      showEdit: false,
      showOverlay: false
    }
  },

  methods: {
    mouseOver () {
      this.showOverlay = true
    },

    mouseOut () {
      this.showOverlay = false
    },

    editImage () {
      this.showEdit = true
      this.showOverlay = false
    },

    closeEdit () {
      this.showEdit = false
      this.selected = false
      this.showOverlay = false
    },

    click (img) {
      this.selected = !this.selected
      if (this.selected) {
        this.selectedImages.push(this)
      } else {
        let idx = this.selectedImages.indexOf(this)
        this.selectedImages.splice(idx, 1)
      }
    }
  }
}
</script>
