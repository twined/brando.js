<template>
  <modal
    :chrome="false"
    :show="true"
    @cancel="closeModal"
    @ok="closeModal"
  >
    <div class="card mb-3">
      <div class="card-header text-center">
        <h5 class="section mb-0">Ny bildeserie</h5>
      </div>
      <div class="card-body">
        <div :class="{'form-group': true, 'has-danger': errors.has('image_series[name]') }">
          <label class="control-label" for="profile_full_name">Navn</label>
          <input v-model="series.name" v-validate="'required'" class="form-control form-control-danger" id="image_series_name" name="image_series[name]" type="text">
          <div class="form-control-feedback">{{ errors.first('image_series[name]') }}</div>
        </div>
        <div :class="{'form-group': true, 'has-danger': errors.has('image_series[credits]') }">
          <label class="control-label" for="profile_full_name">Krediteringer</label>
          <input v-model="series.credits" class="form-control form-control-danger" id="image_series_credits" name="image_series[credits]" type="text">
          <div class="form-control-feedback">{{ errors.first('image_series[credits]') }}</div>
        </div>
        <button @click.prevent="save" class="btn btn-secondary">
          Lagre bildeserie
        </button>
        <button @click.prevent="closeModal" class="btn">
          Avbryt
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { imageAPI } from '../../../api/image'
import { mapActions } from 'vuex'
import Modal from '../../Modal'
import { showError } from '../../../utils'

export default {
  components: {
    Modal
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    imageCategory: {
      type: Object,
      required: true
    },

    saveCallback: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      series: {
        name: '',
        credits: ''
      }
    }
  },

  methods: {
    async save () {
      try {
        if (this.saveCallback) {
          const series = await imageAPI.createImageSeries({ ...this.series, image_category_id: this.imageCategory.id })
          this.saveCallback(series)
        } else {
          await this.createImageSeries({ ...this.series, image_category_id: this.imageCategory.id })
        }
        // scroll to it?
        this.closeModal()
      } catch (err) {
        showError(err)
      }
    },

    closeModal () {
      this.$emit('close')
    },

    ...mapActions('images', [
      'createImageSeries'
    ])
  }
}
</script>
