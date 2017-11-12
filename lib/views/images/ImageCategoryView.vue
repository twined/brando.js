<template>
  <div class="image-categories">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="jumbotron mb-0 text-center">
            <h1 class="display-1 text-uppercase text-strong">BILDER</h1>
            <p class="lead">Administrér nettsidens bildebibliotek</p>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-5">
      <div class="centered-link-list">
        <router-link :to="{ name: 'image-category-detail', params: { categoryId: c.id } }" class="" v-for="c in allImageCategories" :key="c.id">
          {{ c.name }}
        </router-link>
      </div>
    </p>

    <div class="container">
      <transition name="fade" :key="categoryId" mode="out-in">
        <router-view :key="categoryId" class="mt-3 view"></router-view>
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
