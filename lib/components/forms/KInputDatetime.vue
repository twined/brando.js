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

    <VueFlatpickr
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
import VueFlatpickr from '@jacobmischka/vue-flatpickr'

const LOCALE_NO = {
  weekdays: {
    shorthand: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    longhand: [
      'Søndag',
      'Mandag',
      'Tirsdag',
      'Onsdag',
      'Torsdag',
      'Fredag',
      'Lørdag'
    ]
  },
  months: {
    shorthand: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Des'
    ],
    longhand: [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]
  },
  firstDayOfWeek: 1,
  rangeSeparator: ' til ',
  weekAbbreviation: 'Uke',
  scrollTitle: 'Scroll for å endre',
  toggleTitle: 'Klikk for å veksle',
  ordinal: function () {
    return '.'
  }
}

export default {
  components: {
    VueFlatpickr
  },

  props: {
    dateTimeOptions: {
      type: Object,
      default: () => {
        return {
          enableTime: true,
          minuteIncrement: 15,
          time_24hr: true,
          locale: LOCALE_NO,
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
