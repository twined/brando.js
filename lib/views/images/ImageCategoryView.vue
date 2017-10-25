<template>
  <div class="image-categories">
    <div class="bg-white p-4">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h5 class="section mb-3 text-center">BILDEKATEGORIER</h5>
            <div class="centered-link-list">
              <router-link :to="{ name: 'image-category-detail', params: { categoryId: c.id } }" class="" v-for="c in allImageCategories" :key="c.id" exact>
                {{ c.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <transition name="fade" :key="categoryId" mode="out-in">
        <router-view :key="categoryId" class="mt-4 view"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {}
  },

  props: {
    categoryId: {
      required: false,
      type: String,
      default: ''
    }
  },

  async created () {
    await this.fetchImageCategories()
  },

  computed: {
    ...mapGetters('images', [
      'allImageCategories'
    ])
  },

  methods: {
    ...mapActions('images', [
      'fetchImageCategories'
    ])
  }
}
</script>
