<template>
  <div class="villain-component">
    <div :class="{'form-group': true}">
      <div class="label-wrapper">
        <label :for="name" class="control-label" >
          {{ label }}
        </label>
      </div>

      <VillainEditor
        ref="villain"
        :json="innerValue"
        :extra-headers="{'authorization': `Bearer ${this.token}`}"
        @input="$emit('input', $event)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VillainEditor from 'villain-editor'

export default {
  components: {
    VillainEditor
  },

  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },

    baseURL: {
      type: String,
      required: true,
      default: '/admin/api/villain/'
    },

    imageSeries: {
      type: String,
      default: 'post'
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
    },
    ...mapGetters('users', ['token'])
  },

  watch: {
    value (value) {
      this.innerValue = value
    }
  },

  created () {
    this.innerValue = this.value
  }
}
</script>
