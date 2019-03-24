<template>
  <div
    v-if="!loading"
    :class="{'form-group': true, 'has-danger': hasError }"
  >
    <div class="label-wrapper">
      <label
        :for="id"
        class="control-label"
      >
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger" />
        {{ errorText }}
      </span>
    </div>

    <div class="image-preview-wrapper">
      <PictureInput
        :id="id"
        ref="pictureInput"
        :focal="focal"
        :crop="crop"
        :width="width"
        :height="height"
        :prefill="prefill"
        :removable="true"
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
        margin="0"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        size="10"
        button-class="btn btn-outline-secondary"
        @change="onChange"
        @click="onClick"
        @remove="onRemove"
        @focalChanged="onFocalChanged"
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
      default: false
    },

    width: {
      type: Number,
      default: 450
    },

    height: {
      type: Number,
      default: 450
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
      focal: null,
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
      if (this.value) {
        this.focal = this.value['focal'] ? this.value['focal'] : null
      } else {
        this.focal = { x: 50, y: 50 }
      }
    }
  },

  methods: {
    onClick (a) {
    },

    onChange (a) {
      // we have a prefill, and preCheck is false
      if (this.value && !this.preCheck) {
        // do nothing except, set preCheck to true
        this.preCheck = true
        return
      }
      // there's been a change, and we either have no prefill, or we've triggered the prefill check:
      this.innerValue = this.$refs.pictureInput.file
    },

    onRemove (a) {
      this.innerValue = null
    },

    onFocalChanged (f) {
      if (this.innerValue instanceof File) {
        // remove any focal key
        let filename = this.innerValue.name.replace(/\%\%\%(.*)\%\%\%/, '')
        // change the filename to include focal info
        filename = filename + `%%%${f.x}:${f.y}%%%`
        const newFile = new File([this.innerValue], filename, { type: this.innerValue.type })
        this.innerValue = newFile
      } else {
        this.innerValue = {
          ...this.innerValue,
          focal: f
        }
      }
    }
  }
}
</script>
