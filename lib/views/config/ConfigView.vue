<template lang="html">
  <div class="dashboard">
    <transition name="fade">
      <div
        id="content"
        class="container">
        <div class="text-center">
          <h2 class="lead mt-5 text-upper text-strong">Konfigurasjon</h2>
          <hr class="my-4">
          <div
            v-if="cfg"
            class="w-75 mx-auto">
            <div
              v-for="(c, key) in cfg"
              :key="key">
              <template v-if="c.type === 'string'">
                <KInput
                  v-model="c.value"
                  :value="c.value"
                  :has-error="errors.has('c[value]')"
                  :error-text="errors.first('c[value]')"
                  :label="c.description"
                  name="c[value]"
                  placeholder=""
                  data-vv-name="c[value]"
                  data-vv-value-path="innerValue"
                />
              </template>
            </div>
            <div>
              <button
                class="btn btn-primary"
                @click="store">
                Lagre konfigurasjon
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { clone } from '../../utils'

export default {
  data () {
    return {
      cfg: null
    }
  },

  inject: [
    'adminChannel'
  ],

  created () {
    this.adminChannel.channel
      .push('config:get')
      .receive('ok', payload => {
        this.cfg = clone(payload.cfg)
      })
  },

  methods: {
    store () {
      this.adminChannel.channel
        .push('config:set', { cfg: this.cfg })
        .receive('ok', payload => {
          this.$toast.success({ message: 'Konfigurasjon oppdatert' })
        })
    }
  }
}
</script>
