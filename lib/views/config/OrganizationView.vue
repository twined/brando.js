<template>
  <div
    v-if="!loading"
    class="create-organization">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="section mb-0">
            Endre
          </h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col">
              <KInput
                v-model="organization.name"
                v-validate="'required'"
                :value="organization.name"
                :has-error="errors.has('organization[name]')"
                :error-text="errors.first('organization[name]')"
                name="organization[name]"
                label="Navn"
                placeholder="Navn" />
            </div>

            <div class="col">
              <KInput
                v-model="organization.alternate_name"
                :value="organization.alternate_name"
                :has-error="errors.has('organization[alternate_name]')"
                :error-text="errors.first('organization[alternate_name]')"
                name="organization[alternate_name]"
                label="Kortere form av navnet"
                placeholder="AB" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <KInput
                v-model="organization.email"
                :value="organization.email"
                :has-error="errors.has('organization[email]')"
                :error-text="errors.first('organization[email]')"
                name="organization[email]"
                label="Epost"
                placeholder="Epost" />
            </div>
            <div class="col">
              <KInput
                v-model="organization.phone"
                :value="organization.phone"
                :has-error="errors.has('organization[phone]')"
                :error-text="errors.first('organization[phone]')"
                name="organization[phone]"
                label="Telefon"
                placeholder="Telefon" />
            </div>
          </div>

          <KInput
            v-model="organization.address"
            :value="organization.address"
            :has-error="errors.has('organization[address]')"
            :error-text="errors.first('organization[address]')"
            name="organization[address]"
            label="Adresse"
            placeholder="Adresse" />

          <div class="row">
            <div class="col">
              <KInput
                v-model="organization.zipcode"
                :value="organization.zipcode"
                :has-error="errors.has('organization[zipcode]')"
                :error-text="errors.first('organization[zipcode]')"
                name="organization[zipcode]"
                label="Postnr"
                placeholder="Postnr" />
            </div>
            <div class="col">
              <KInput
                v-model="organization.city"
                :value="organization.city"
                :has-error="errors.has('organization[city]')"
                :error-text="errors.first('organization[city]')"
                name="organization[city]"
                label="By"
                placeholder="By" />
            </div>
          </div>

          <KInput
            v-model="organization.country"
            :value="organization.country"
            :has-error="errors.has('organization[country]')"
            :error-text="errors.first('organization[country]')"
            name="organization[country]"
            label="Land"
            placeholder="NO" />

          <KInput
            v-model="organization.description"
            v-validate="'required'"
            :maxlength="155"
            :value="organization.description"
            :has-error="errors.has('organization[description]')"
            :error-text="errors.first('organization[description]')"
            name="organization[description]"
            label="Beskrivelse"
            placeholder="Beskrivelse" />

          <div class="row">
            <div class="col">
              <KInput
                v-model="organization.title_prefix"
                :value="organization.title_prefix"
                :has-error="errors.has('organization[title_prefix]')"
                :error-text="errors.first('organization[title_prefix]')"
                name="organization[title_prefix]"
                label="Tittel prefiks"
                placeholder="AB | " />
            </div>
            <div class="col">
              <KInput
                v-model="organization.title"
                :value="organization.title"
                :maxlength="60"
                :has-error="errors.has('organization[title]')"
                :error-text="errors.first('organization[title]')"
                name="organization[title]"
                label="Hovedtittel (fallback)"
                placeholder="Tittel" />
            </div>
            <div class="col">
              <KInput
                v-model="organization.title_postfix"
                :value="organization.title_postfix"
                :has-error="errors.has('organization[title_postfix]')"
                :error-text="errors.first('organization[title_postfix]')"
                name="organization[title_postfix]"
                label="Tittel postfiks"
                placeholder=" | AB" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <KInputImage
                v-model="organization.image"
                :value="organization.image"
                :has-error="errors.has('organization[image]')"
                :error-text="errors.first('organization[image]')"
                name="organization[image]"
                label="Bilde" />
            </div>
            <div class="col">
              <KInputImage
                v-model="organization.logo"
                :value="organization.logo"
                :has-error="errors.has('organization[logo]')"
                :error-text="errors.first('organization[logo]')"
                name="organization[logo]"
                label="Logo" />
            </div>
          </div>

          <KInput
            v-model="organization.url"
            v-validate="'required'"
            :value="organization.url"
            :has-error="errors.has('organization[url]')"
            :error-text="errors.first('organization[url]')"
            name="organization[url]"
            label="URL"
            placeholder="URL" />

          <div class="form-group">
            <div class="label-wrapper">
              <label
                class="control-label">
                META variabler
              </label>
            </div>
            <table class="table">
              <tr
                v-for="meta in organization.metas"
                :key="meta.id">
                <td>
                  {{ meta.key }}
                </td>
                <td>
                  {{ meta.value }}
                </td>
                <td class="fit">
                  <button
                    class="btn btn-danger"
                    @click="deletemeta(meta)">
                    Slett
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="newmeta.key"
                    class="form-control"
                    type="text"
                    placeholder="Nøkkel">
                </td>
                <td>
                  <input
                    v-model="newmeta.value"
                    class="form-control"
                    type="url"
                    placeholder="Verdi">
                </td>
                <td class="fit">
                  <button
                    class="btn btn-success"
                    @click="addmeta">
                    Legg til
                  </button>
                </td>
              </tr>
            </table>
          </div>

          <div class="form-group">
            <div class="label-wrapper">
              <label
                class="control-label">
                Linker (sosiale medier)
              </label>
            </div>
            <table class="table">
              <tr
                v-for="link in organization.links"
                :key="link.id">
                <td>
                  {{ link.name }}
                </td>
                <td>
                  {{ link.url }}
                </td>
                <td class="fit">
                  <button
                    class="btn btn-danger"
                    @click="deletelink(link)">
                    Slett
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="newlink.name"
                    class="form-control"
                    type="text"
                    placeholder="Navn">
                </td>
                <td>
                  <input
                    v-model="newlink.url"
                    class="form-control"
                    type="url"
                    placeholder="URL">
                </td>
                <td class="fit">
                  <button
                    class="btn btn-success"
                    @click="addlink">
                    Legg til
                  </button>
                </td>
              </tr>
            </table>
          </div>

          <button
            :disabled="!!loading"
            class="btn btn-secondary"
            @click="validate">
            Lagre
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

import nprogress from 'nprogress'
import { showError, validateImageParams, stripParams } from '../../utils'
import { alertError } from '../../utils/alerts'
import { organizationAPI } from '../../api/organization'

export default {
  data () {
    return {
      loading: 0,
      organization: null,
      newlink: {
        name: '',
        url: ''
      },
      newmeta: {
        key: '',
        value: ''
      }
    }
  },

  inject: [
    'adminChannel'
  ],

  async created () {
    this.loading++
    const v = await organizationAPI.getOrganization()
    this.organization = { ...v }
    this.loading--
  },

  methods: {
    addlink () {
      this.organization.links.push({
        name: this.newlink.name,
        url: this.newlink.url
      })
      this.newlink.name = ''
      this.newlink.url = ''
    },

    deletelink (link) {
      const l = this.organization.links.find(l => l.id === link.id)
      const idx = this.organization.links.indexOf(l)
      this.organization.links = [
        ...this.organization.links.slice(0, idx),
        ...this.organization.links.slice(idx + 1)
      ]
    },

    addmeta () {
      this.organization.metas.push({
        key: this.newmeta.key,
        value: this.newmeta.value
      })
      this.newmeta.key = ''
      this.newmeta.value = ''
    },

    deletemeta (meta) {
      const l = this.organization.metas.find(l => l.id === meta.id)
      const idx = this.organization.metas.indexOf(l)
      this.organization.metas = [
        ...this.organization.metas.slice(0, idx),
        ...this.organization.metas.slice(idx + 1)
      ]
    },

    validate () {
      this.$validator.validateAll().then(valid => {
        if (!valid) {
          alertError('Feil i skjema', 'Vennligst se over og rett feil i rødt')
          this.loading = false
          return
        }
        this.save()
      }).catch(err => {
        console.error(err)
      })
    },

    async save () {
      this.loading = false
      let params = { ...this.organization }

      // strip out params we don't want sent in the mutation
      stripParams(params, ['__typename', 'id'])

      params.links.map((item) => (
        delete item.__typename
      ))

      params.metas.map((item) => (
        delete item.__typename
      ))

      // validate image params, if any, to ensure they are files
      validateImageParams(params, ['image', 'logo'])

      try {
        nprogress.start()
        await organizationAPI.updateOrganization(params)
        nprogress.done()
        this.$toast.success({ message: 'Objekt endret' })
      } catch (err) {
        showError(err)
      }
    }
  }
}
</script>
