<template>
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label class="control-label">
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger"/>
        {{ errorText }}
      </span>
    </div>

    <Multiselect
      v-model="innerValue"
      :options="options"
      :track-by="optionValueKey"
      :label="optionLabelKey"
      :multiple="multiple"
    />
  </div>
</template>

<script>
export default {
  props: {
    optionValueKey: {
      type: String,
      required: true,
      default: 'value'
    },

    optionLabelKey: {
      type: String,
      required: true,
      default: 'name'
    },

    multiple: {
      type: Boolean,
      default: true
    },

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
