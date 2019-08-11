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
      :maxlength="maxlength"
      :name="name"
      class="form-control form-control-danger"
      type="text">
    <p
      v-if="maxlength"
      class="maxLength">
      {{ maxlength - innerValue.length }}
    </p>
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
      default: null
    },

    helpText: {
      type: String,
      default: null
    },

    label: {
      type: String,
      required: true
    },

    maxlength: {
      type: Number,
      default: null
    },

    placeholder: {
      type: String,
      required: false,
      default: null
    },

    name: {
      type: String,
      required: true
    },

    value: {
      type: [String, Number],
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
