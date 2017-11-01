<template>
  <div class="search-input">
    <i class="fal fa-search search-icon"></i>
    <input v-model="innerValue" @keyup.prevent.enter="perform" @input="onInput" class="form-control" type="text" />
    <i @click="reset" class="fal fa-window-close close-icon text-danger" v-if="filtered"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      innerValue: '',
      filtered: false
    }
  },

  methods: {
    onInput () {
      this.$emit('input', this.innerValue)
    },

    perform () {
      this.filtered = true
      this.$emit('search')
    },

    reset () {
      this.innerValue = ''
      this.filtered = false
      this.$emit('reset')
    }
  }
}
</script>
