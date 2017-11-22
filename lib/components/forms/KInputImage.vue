<template lang="html">
  <div :class="{'form-group': true, 'has-danger': hasError }" v-if="!loading">
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

    <div class="image-preview-wrapper">
      <PictureInput
        :crop="crop"
        ref="pictureInput"
        @change="onChange"
        @click="onClick"
        :width="width"
        :height="height"
        margin="16"
        :prefill="prefill"
        :id="id"
        :name="name"
        accept="image/jpeg,image/png,image/gif"
        size="10"
        buttonClass="btn btn-outline-secondary"
        :customStrings="{
          upload: 'Dingsen du bruker støtter ikke filopplasting :(',
          drag: 'Klikk eller slipp bildet ditt her',
          tap: 'Tapp her for å velge et bilde fra galleriet ditt',
          change: 'Skift bilde ↑',
          remove: 'Fjern bilde ↑',
          select: 'Velg et bilde',
          fileSize: 'Fila er for stor!',
          fileType: 'Filtypen er ikke støttet'
        }"
      />
    </div>
  </div>
</template>

<script>
import PictureInput from '../PictureInput.vue'

export default {
  components: {
    PictureInput
  },

  props: {
    hasError: {
      type: Boolean,
      default: false
    },

    previewKey: {
      type: String,
      default: 'thumb'
    },

    errorText: {
      type: String
    },

    crop: {
      type: Boolean,
      default: true
    },

    width: {
      default: 300
    },

    height: {
      default: 300
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
      required: false,
      default: null
    }
  },

  created () {
    this.innerValue = this.value
    if (typeof this.value === 'string') {
      this.prefill = this.value
    } else {
      this.prefill = this.value ? this.value[this.previewKey] : null
    }
  },

  data () {
    return {
      loading: 0,
      preCheck: false,
      innerValue: '',
      prefill: null
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
    onClick (a) {
      console.log('clicked. does this mean it changed??')
    },

    onChange (a) {
      // we have a prefill, and preCheck is false
      if (this.value && !this.preCheck) {
        console.log('we have prefill and preCheck is false')
        // do nothing except, set preCheck to true
        this.preCheck = true
        return
      }
      console.log('theres been a change, and we either have no prefill, or we have triggered the prefill check:')
      // there's been a change, and we either have no prefill, or we've triggered the prefill check:
      this.innerValue = this.$refs.pictureInput.file
    }
  }
}
</script>
