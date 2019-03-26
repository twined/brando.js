<template>
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label
        :for="id"
        class="control-label">
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger" />
        {{ errorText }}
      </span>
    </div>

    <div
      v-for="o in options"
      :key="o.value"
      class="form-check">
      <label class="form-check-label">
        <input
          v-model="innerValue"
          :name="name"
          :value="o.value"
          class="form-check-input"
          type="checkbox">
        {{ o.name }}
      </label>
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

    /**
     * [ { name: 'Option name', value: 1 }]
     */
    options: {
      type: Array,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    value: {
      required: false,
      default: '',
      type: null
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
