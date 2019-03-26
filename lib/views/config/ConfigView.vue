<template lang="html">
  <div class="dashboard">
    <transition name="fade">
      <div
        id="content"
        class="container">
        <div class="text-center">
          <h2 class="lead mt-5 text-upper text-strong">
            Konfigurasjon
          </h2>
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
                  data-vv-value-path="innerValue" />
              </template>
              <template v-else-if="c.type === 'image'">
                <div class="form-group text-left">
                  <div class="label-wrapper">
                    <label class="control-label">
                      {{ c.description }}
                    </label>
                  </div>
                  <div v-if="c.value">
                    <img :src="'/media/' + c.value.sizes.thumb">
                  </div>
                  <button
                    class="btn btn-primary mt-2"
                    @click="showModal = true">
                    Velg bilde
                  </button>
                  <ModalImageSelect
                    :show="showModal"
                    :value="c.value"
                    :image-series-id="c.image_series_id"
                    @change="c.value = $event"
                    @close="showModal = false" />
                </div>
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
import ModalImageSelect from '../../components/images/modals/ModalImageSelect'

export default {
  components: {
    ModalImageSelect
  },

  data () {
    return {
      cfg: null,
      showModal: false
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
    closeModal () {
      this.showModal = false
    },

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
