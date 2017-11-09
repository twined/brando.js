<template>
  <div class="villain-component">
    <div :class="{'form-group': true}">
      <div class="label-wrapper">
        <label class="control-label" :for="name">
          {{ label }}
        </label>
      </div>
      <textarea v-model="innerValue" class="post" :id="name"></textarea>
    </div>
  </div>
</template>

<script>
import { Editor } from 'villainjs'

export default {
  props: {
    label: {
      type: String,
      required: false
    },

    baseURL: {
      type: String,
      required: true,
      default: '/admin/api/'
    },

    imageSeries: {
      type: String,
      required: true
    },

    value: {
      type: String,
      default: `
      [
        {
          "type": "text",
          "data": {
            "text": "Text",
            "type": "paragraph"
          }
        }
      ]
      `
    }
  },

  data () {
    return {
      innerValue: null
    }
  },

  computed: {
    name () {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqid = randLetter + Date.now()
      return 'villain' + uniqid
    }
  },

  watch: {
    innerValue (value) {
      this.$emit('input', value)
    },

    value (value) {
      this.$villain.setData(value)
      this.innerValue = value
    }
  },

  mounted () {
    const id = '#' + this.name
    this.$villain = new Editor({
      textArea: id,
      baseURL: this.baseURL,
      imageSeries: this.imageSeries
    })
  },

  created () {
    console.log('villain this.value', this.value)
    this.innerValue = this.value
  },

  methods: {

  }
}
</script>
