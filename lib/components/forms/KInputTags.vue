<template>
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label
        :for="id"
        class="control-label"
      >
        {{ label }} ({{ separator === ' ' ? 'separér med mellomrom' : 'separér med komma' }})
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger" />
        {{ errorText }}
      </span>
    </div>

    <input
      :id="id"
      v-model="innerValue"
      :name="name"
      placeholder="tags"
      class="form-control form-control-danger text-mono"
      type="text"
    >
    <ul
      v-if="value && value.length"
      class="tags-list"
    >
      <li
        v-for="(t, idx) in value"
        :key="idx"
      >
        {{ t }}
      </li>
    </ul>
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
      default: ''
    },

    separator: {
      type: String,
      default: ' '
    },

    label: {
      type: String,
      required: true
    },

    placeholder: {
      type: String,
      required: false,
      default: ''
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: false,
      default: ''
    },

    value: {
      required: false,
      default: '',
      type: null
    }
  },

  computed: {
    id () {
      return this.name.replace('[', '_').replace(']', '_')
    },

    innerValue: {
      get () {
        return (this.value || []).join(this.separator)
      },
      set (newValue) {
        newValue = newValue.trim() ? newValue.split(this.separator) : []
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
