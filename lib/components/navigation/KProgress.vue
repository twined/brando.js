<template>
  <div
    class="alert-backdrop">
    <div class="kprogress">
      <div
        v-if="percent"
        class="kprogress-percent">
        {{ percent }}%
      </div>
      <div
        class="kprogress-content"
        v-html="content" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: ''
    },

    percent: {
      type: Number,
      default: null
    }
  },

  computed: {
    content () {
      return this.status + '<span>.</span><span>.</span><span>.</span>'
    }
  }
}
</script>
