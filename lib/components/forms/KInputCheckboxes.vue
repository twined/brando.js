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

    <div class="form-check" v-for="o in options" :key="o.value">
      <label class="form-check-label">
        <input
          v-model="innerValue"
          class="form-check-input"
          :name="name"
          type="checkbox"
          :value="o.value"
        />
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
      type: String
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

    value (value) {
      this.innerValue = value
    }
  }
}
</script>
