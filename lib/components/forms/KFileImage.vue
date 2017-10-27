<template lang="html">
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label
        class="control-label"
        :for="id"
      >
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger"></i>
        {{ errorText }}
      </span>
    </div>

    <picture-input
      ref="pictureInput"
      @change="onChange"
      width="600"
      height="600"
      margin="16"
      :id="id"
      :name="name"
      accept="image/jpeg,image/png,image/gif"
      size="10"
      buttonClass="btn btn-secondary"
      :customStrings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drag a 😺 GIF or GTFO'
      }"
    />
  </div>
</template>

<script>
import PictureInput from 'vue-picture-input'

export default {
  components: {
    PictureInput
  },

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
      required: true
    }
  },

  created () {
    console.log(this.$validator)
    console.log(this.errors)
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

  methods: {
    onChange () {
      this.innerValue = this.$refs.pictureInput.file
    }
  }
}
</script>
