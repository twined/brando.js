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
      :placeholder="placeholder"
      :id="id"
      :name="name"
      class="form-control form-control-danger"
      type="number"
    >
    <p class="help-text" v-if="helpText">
      <i class="fa fa-fw fa-arrow-alt-circle-up mr-1"></i>
      <span v-html="helpText" />
    </p>
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

    helpText: {
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

    value: {
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
      this.$emit('input', parseInt(value))
    },

    value (value) {
      this.innerValue = parseInt(value)
    }
  }
}
</script>
