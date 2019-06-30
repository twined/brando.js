<template lang="html">
  <div class="dashboard">
    <transition name="fade">
      <div
        id="content"
        class="container">
        <div class="w-75 mx-auto">
          <h2 class="lead mt-5 text-upper text-strong">
            Konfigurasjon

            <button
              class="btn btn-outline-secondary float-right"
              @click="showNewModal">
              Ny konfigurasjonsnøkkel
            </button>
          </h2>
          <hr class="my-4">
          <div
            v-if="cfg"
            class="">
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
            <modal
              v-if="showNew"
              :chrome="false"
              :large="true"
              :show="true"
              @cancel="closeNewModal"
              @ok="storeNew">
              <div class="card">
                <div class="card-header">
                  Ny konfigurasjonsnøkkel
                </div>
                <div class="card-body">
                  <KInput
                    v-model="newKey.key"
                    :value="newKey.key"
                    :has-error="errors.has('newKey[key]')"
                    :error-text="errors.first('newKey[key]')"
                    name="newKey[key]"
                    label="Nøkkelnavn (uten mellomrom)"
                    data-vv-name="newKey[key]"
                    data-vv-value-path="innerValue" />

                  <KInputSelect
                    v-model="newKey.type"
                    :value="newKey.type"
                    :options="[
                      { name: 'Tekstverdi', value: 'string' },
                      { name: 'Bilde', value: 'image' }
                    ]"
                    :has-error="errors.has('newKey[type]')"
                    :error-text="errors.first('newKey[type]')"
                    name="newKey[type]"
                    label="Nøkkeltype"
                    data-vv-name="newKey[type]"
                    data-vv-value-path="innerValue" />
                  <KInput
                    v-model="newKey.description"
                    :value="newKey.description"
                    :has-error="errors.has('newKey[description]')"
                    :error-text="errors.first('newKey[description]')"
                    name="newKey[description]"
                    label="Beskrivelse"
                    data-vv-name="newKey[description]"
                    data-vv-value-path="innerValue" />

                  <button
                    class="btn btn-primary mt-2"
                    @click="storeNew">
                    Lagre nøkkel
                  </button>
                </div>
              </div>
            </modal>
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
      showModal: false,
      showNew: false,
      newKey: {}
    }
  },

  inject: [
    'adminChannel'
  ],

  created () {
    this.getConfig()
  },

  methods: {
    getConfig () {
      this.adminChannel.channel
        .push('config:get')
        .receive('ok', payload => {
          this.cfg = clone(payload.cfg)
        })
    },

    showNewModal () {
      this.showNew = true
    },

    closeNewModal () {
      this.showNew = false
    },

    storeNew () {
      this.adminChannel.channel
        .push('config:add_key', { key: this.newKey.key, description: this.newKey.description, type: this.newKey.type })
        .receive('ok', payload => {
          this.newKey = {}
          this.closeNewModal()
          this.getConfig()
        })
    },

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
