<template>
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

    <div class="file-wrapper">
      <FileInput
        ref="fileInput"
        :prefill="prefill"
        :id="id"
        :name="name"
        :custom-strings="{
          upload: 'Dingsen du bruker støtter ikke filopplasting :(',
          drag: 'Klikk eller slipp filen ditt her',
          tap: 'Tapp her for å velge en fil fra galleriet ditt',
          change: 'Skift fil ↑',
          remove: 'Fjern fil ↑',
          select: 'Velg en fil',
          fileSize: 'Fila er for stor!',
          fileType: 'Filtypen er ikke støttet'
        }"
        accept="*"
        size="10"
        button-class="btn btn-outline-secondary"
        @change="onChange"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script>
import FileInput from '../FileInput.vue'

export default {
  components: {
    FileInput
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
    console.log(this.value)
    if (typeof this.value === 'string') {
      this.prefill = this.value
    } else {
      this.prefill = this.value ? this.value['url'] : null
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
      this.innerValue = this.$refs.fileInput.file
    }
  }
}
</script>
