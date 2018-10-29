<template>
  <div
    v-if="!loading"
    :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label
        :for="id"
        class="control-label"
      >
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger"/>
        {{ errorText }}
      </span>
    </div>

    <div class="image-preview-wrapper">
      <PictureInput
        ref="pictureInput"
        :crop="crop"
        :width="width"
        :height="height"
        :prefill="prefill"
        :id="id"
        :name="name"
        :custom-strings="{
          upload: 'Dingsen du bruker støtter ikke filopplasting :(',
          drag: 'Klikk eller slipp bildet ditt her',
          tap: 'Tapp her for å velge et bilde fra galleriet ditt',
          change: 'Skift bilde ↑',
          remove: 'Fjern bilde ↑',
          select: 'Velg et bilde',
          fileSize: 'Fila er for stor!',
          fileType: 'Filtypen er ikke støttet'
        }"
        margin="16"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        size="10"
        button-class="btn btn-outline-secondary"
        @change="onChange"
        @click="onClick"
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
      type: String,
      default: ''
    },

    crop: {
      type: Boolean,
      default: true
    },

    width: {
      type: Number,
      default: 300
    },

    height: {
      type: Number,
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
      default: null,
      type: null
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

  created () {
    this.innerValue = this.value
    if (typeof this.value === 'string') {
      this.prefill = this.value
    } else {
      this.prefill = this.value ? this.value[this.previewKey] : null
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
