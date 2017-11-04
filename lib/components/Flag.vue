<template>
  <div class="flag-wrapper">
    <span :class="'flag' + ' ' + value"></span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>
