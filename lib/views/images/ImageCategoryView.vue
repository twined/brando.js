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

    <div class="container centered-link-list mt-5">
      <router-link
        v-for="c in allImageCategories"
        :key="c.id"
        :to="{ name: 'image-category-detail', params: { categoryId: c.id } }">
        {{ c.name }}
      </router-link>
    </div>

    <div class="container">
      <transition
        :key="categoryId"
        name="fade"
        mode="out-in">
        <router-view
          :key="categoryId"
          class="mt-3 view"/>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  props: {
    categoryId: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },

  computed: {
    ...mapGetters('images', [
      'allImageCategories'
    ])
  },

  async created () {
    await this.fetchImageCategories()
  },

  methods: {
    ...mapActions('images', [
      'fetchImageCategories'
    ])
  }
}
</script>
