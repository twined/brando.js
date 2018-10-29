<template>
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="form-check">
      <div class="label-wrapper">
        <label class="form-check-label">
          <input
            v-model="innerValue"
            :name="name"
            class="form-check-input"
            type="checkbox"
          >
          {{ label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasError: {
      type: Boolean,
      default: false
    },

    errorText: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    value: {
      type: [String, Number, Boolean],
      required: false,
      default: ''
    }
  },

  data () {
    return {
      innerValue: ''
    }
  },

  computed: {
    id () {
      return this.name.replace('[', '_').replace(']', '_')
    }
  },

  watch: {
    innerValue (value) {
      this.$emit('input', value)
    },

    value (value) {
      this.innerValue = value
    }
  },

  created () {
    this.innerValue = this.value
  }
}
</script>
