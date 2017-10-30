<template lang="html">
  <div :class="{'form-group': true, 'has-danger': hasError }">
    <div class="label-wrapper">
      <label class="control-label" :for="id">
        {{ label }}
      </label>
      <span>
        <i class="fa fa-exclamation-circle text-danger"></i>
        {{ errorText }}
      </span>
    </div>

    <Flatpickr
      v-model="innerValue"
      :placeholder="placeholder"
      :id="id"
      class="form-control"
      :options="dateTimeOptions"
    />
  </div>
</template>

<script>
import moment from 'moment-timezone'

import { no } from 'flatpickr/dist/l10n/no'

export default {
  props: {
    dateTimeOptions: {
      type: Object,
      default: () => {
        return {
          enableTime: true,
          minuteIncrement: 15,
          time_24hr: true,
          locale: no,
          altInput: true,
          altFormat: 'l j F, Y @ H:i',
          dateFormat: 'Z'
        }
      }
    },

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
    },

    value: {
      default: () => {
        console.log(moment.tz('Europe/Oslo').format())
        return moment.tz('Europe/Oslo').format()
      }
    }
  },

  created () {
    this.innerValue = this.value
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
  }
}
</script>
