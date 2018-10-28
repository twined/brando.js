<template>
  <div
    :class="{selected: this.selected}"
    class="image-wrapper float-left m-1"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
    @click.prevent="click">
    <div @click.stop.prevent="editImage" class="overlay" v-show="showOverlay">
      <i class="fa fa-search fa-fw"></i>
    </div>
    <modal
      :chrome="false"
      :large="true"
      :show="true"
      @cancel="closeEdit"
      @ok="closeEdit"
      v-if="showEdit"
    >
      <div class="card">
        <div class="card-header">
          Bildedetaljer
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <img :src="img.image.path" class="img-fluid" />

              <div class="row mt-4">
                <div class="col-md-6">
                  <dt>
                    Dimensjoner
                  </dt>
                  <dd v-if="img.image.width && img.image.height">
                    {{ img.image.width }}x{{ img.image.height }}
                  </dd>
                  <dd v-else>
                    Ingen dimensjoner
                  </dd>
                </div>
                <div class="col-md-6">
                  <dt>
                    Optimalisert
                  </dt>
                  <dd>
                    <CheckOrX :val="img.image.optimized" />
                  </dd>
                </div>
              </div>
            </div>
            <div class="col-6">
              <KInput
                v-model="img.image.title"
                :value="img.image.title"
                name="img.image[title]"
                label="Evt. beskrivelse"
                placeholder="Evt. beskrivelse"
                data-vv-name="img.image[title]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('img.image[title]')"
                :error-text="errors.first('img.image[title]')"
              />
              <KInput
                v-model="img.image.credits"
                :value="img.image.credits"
                name="img.image[credits]"
                label="Evt. kreditering"
                placeholder="Evt. kreditering"
                data-vv-name="img.image[credits]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('img.image[credits]')"
                :error-text="errors.first('img.image[credits]')"
              />
              <dt>
                Filnavn
              </dt>
              <dd>
                {{ img.image.path }}
              </dd>

              <button @click.prevent="saveEdit" class="btn btn-outline-secondary btn-block">Lagre</button>
              <button @click.prevent="closeEdit" class="btn btn-outline-secondary btn-block">Lukk</button>
            </div>
          </div>
        </div>
      </div>
    </modal>

    <img :src="img.image.thumb" class="img-fluid" />
  </div>
</template>

<script>

import CheckOrX from '../CheckOrX.vue'
import Modal from '../Modal.vue'

import { clone } from '../../utils'

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
      img: {},
      selected: false,
      showEdit: false,
      showOverlay: false
    }
  },

  inject: [
    'adminChannel'
  ],

  created () {
    this.img = clone(this.image)
    console.log(this.img)
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

    saveEdit () {
      this.adminChannel.channel.push('image:update', this.img)

      this.showEdit = false
      this.selected = false
      this.showOverlay = false
    },

    click (img) {
      // don't select if modal is open.
      if (!this.showEdit) {
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
}
</script>
