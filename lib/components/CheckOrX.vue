<template>
  <i
    v-if="val"
    class="fal fa-check-circle"
    aria-hidden="true"/>
  <i
    v-else-if="!val && !blankIfFalse"
    class="fal fa-times-circle"
    aria-hidden="true"/>
</template>
<script>
export default {
  props: {
    val: {
      type: Boolean,
      required: true
    },

    blankIfFalse: {
      type: Boolean,
      default: false,
      required: false
    }
  }
}
</script>
