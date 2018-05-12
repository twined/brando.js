<template lang="html">
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label class="control-label" :for="id">
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger"></i>
        {{ errorText }}
      </span>
    </div>

    <input
      v-model="innerValue"
      placeholder="url"
      :id="id"
      class="form-control form-control-danger text-mono"
      :name="name"
      type="text"
    >
  </div>
</template>

<script>
import slug from 'url-slug'

export default {
  props: {
    hasError: {
      type: Boolean,
      default: false
    },

    errorText: {
      type: String
    },

    label: {
      type: String,
      required: true
    },

    placeholder: {
      type: String,
      required: false
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: false
    },

    from: {
      required: true
    },

    value: {
      required: false,
      default: ''
    }
  },

  created () {
    this.innerValue = this.value
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

    from (value) {
      this.innerValue = slug(value)
    },

    value (value) {
      this.innerValue = value
    }
  }
}
</script>
