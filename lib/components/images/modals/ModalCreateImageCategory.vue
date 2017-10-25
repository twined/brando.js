<template>
  <modal
    :chrome="false"
    :show="showModal"
    @cancel="closeModal"
    @ok="closeModal"
    v-if="showModal"
  >
    <div class="card mb-3">
      <div class="card-header text-center">
        <h5 class="section mb-0">Ny bildekategori</h5>
      </div>
      <div class="card-body">
        <div :class="{'form-group': true, 'has-danger': errors.has('image_category[name]') }">
          <label class="control-label" for="profile_full_name">Navn</label>
          <input v-model="category.name" v-validate="'required'" class="form-control form-control-danger" id="image_category_name" name="image_category[name]" type="text">
          <div class="form-control-feedback">{{ errors.first('image_category[name]') }}</div>
        </div>
        <button @click.prevent="save" class="btn btn-secondary">
          Lagre bildekategori
        </button>
        <button @click.prevent="closeModal" class="btn">
          Avbryt
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
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
    }
  },

  data () {
    return {
      category: {
        name: ''
      }
    }
  },

  methods: {
    async save () {
      try {
        const c = await this.createImageCategory(this.category)
        this.$router.push({ name: 'image-category-detail', params: { categoryId: c.id } })
      } catch (err) {
        showError(err)
      }
    },

    closeModal () {
      this.$emit('close')
    },

    ...mapActions('images', [
      'createImageCategory'
    ])
  }
}
</script>
