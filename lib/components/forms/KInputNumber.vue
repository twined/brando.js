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

    <input
      :id="id"
      v-model="innerValue"
      :placeholder="placeholder"
      :name="name"
      class="form-control form-control-danger"
      type="number">
    <p
      v-if="helpText"
      class="help-text">
      <i class="fa fa-fw fa-arrow-alt-circle-up mr-1" />
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
      type: String,
      default: ''
    },

    helpText: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      required: true
    },

    placeholder: {
      type: String,
      required: false,
      default: ''
    },

    name: {
      type: String,
      required: true
    },

    value: {
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
      this.$emit('input', parseInt(value))
    },

    value (value) {
      this.innerValue = parseInt(value)
    }
  },

  created () {
    this.innerValue = this.value
  }
}
</script>
