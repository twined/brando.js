<template>
  <div class="image-categories">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="jumbotron text-center">
            <h1 class="display-1 text-uppercase text-strong">BILDER</h1>
            <p class="lead">Administrér nettsidens bildebibliotek</p>
            <hr class="my-4">
            <p>
              <h5 class="section mb-3 text-center">BILDEKATEGORIER</h5>
              <div class="centered-link-list">
                <router-link :to="{ name: 'image-category-detail', params: { categoryId: c.id } }" class="" v-for="c in allImageCategories" :key="c.id" exact>
                  {{ c.name }}
                </router-link>
              </div>
            </p>
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
