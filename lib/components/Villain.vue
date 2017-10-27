<template>
  <div class="villain-component">
    <div class="form-group">
      <label :for="name" class="control-label">
        {{ label }}
      </label>
      <textarea class="post" :id="name">
        [
          {
            "type": "text",
            "data": {
              "text": "Text",
              "type": "paragraph"
            }
          }
        ]
      </textarea>
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
      required: true
    },
    imageSeries: {
      type: String,
      required: true
    }
  },

  computed: {
    name () {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqid = randLetter + Date.now()
      return 'villain' + uniqid
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

  methods: {
    created () {
      console.log(this)
    }
  }
}
</script>
