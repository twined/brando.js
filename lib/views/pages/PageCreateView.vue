<template>
  <div class="create-post">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="section mb-0">Opprett side</h5>
        </div>
        <div class="card-body">
          <KInputSelect
            v-model="page.parent_id"
            :value="page.parent_id"
            :options="parents"
            name="page[parent_id]"
            label="Tilhørende side"
            data-vv-name="page[parent_id]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[parent_id]')"
            :error-text="errors.first('page[parent_id]')"
          />
          <KInputSelect
            v-model="page.language"
            :value="page.language"
            :options="[
              { name: 'English', value: 'en' },
              { name: 'Norsk', value: 'no' }
            ]"
            name="page[language]"
            label="Språk"
            v-validate="'required'"
            data-vv-name="page[language]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[language]')"
            :error-text="errors.first('page[language]')"
          />

          <KInput
            v-model="page.key"
            :value="page.key"
            name="page[key]"
            type="text"
            label="Nøkkel"
            placeholder="Nøkkel"
            v-validate="'required'"
            data-vv-name="page[key]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[key]')"
            :error-text="errors.first('page[key]')"
          />

          <KInput
            v-model="page.title"
            :value="page.title"
            name="page[title]"
            type="text"
            label="Tittel"
            placeholder="Tittel"
            v-validate="'required'"
            data-vv-name="page[title]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[title]')"
            :error-text="errors.first('page[title]')"
          />

          <Villain
            :value="page.data"
            label="Innhold"
            @input="page.data = $event"
          />

          <div class="row">
            <div class="col">
              <KInputTextarea
                v-model="page.meta_description"
                :rows="2"
                name="page[meta_description]"
                type="text"
                label="META beskrivelse (for søkemotorer)"
                data-vv-name="page[meta_description]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('page[meta_description]')"
                :error-text="errors.first('page[meta_description]')"
              />

              <KInputTextarea
                v-model="page.meta_keywords"
                :rows="1"
                name="page[meta_keywords]"
                type="text"
                label="META nøkkelord (for søkemotorer)"
                data-vv-name="page[meta_keywords]"
                data-vv-value-path="innerValue"
                :has-error="errors.has('page[meta_keywords]')"
                :error-text="errors.first('page[meta_keywords]')"
              />
            </div>
          </div>

          <KInput
            v-model="page.css_classes"
            :value="page.css_classes"
            name="page[css_classes]"
            type="text"
            label="Ekstra CSS klasser"
            placeholder="Ekstra CSS klasser"
            data-vv-name="page[css_classes]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[css_classes]')"
            :error-text="errors.first('page[css_classes]')"
          />

          <button :disabled="!!loading" @click="validate" class="btn btn-secondary">
            Lagre side
          </button>

          <router-link :disabled="!!loading" :to="{ name: 'pages' }" class="btn btn-outline-secondary">
            Tilbake til oversikten
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import nprogress from 'nprogress'
import showError from 'kurtz/lib/utils/showError'
import { pageAPI } from 'kurtz/lib/api/page'

export default {
  data () {
    return {
      loading: 0,
      parents: [],
      page: {
        key: '',
        title: '',
        slug: '',
        data: '',

        status: 'published',
        language: 'en',
        meta_description: '',
        meta_keywords: ''
      }
    }
  },

  inject: [
    'adminChannel'
  ],

  created () {
    this.getParents()
  },

  methods: {
    getParents () {
      this.adminChannel.channel
        .push('pages:list_parents')
        .receive('ok', payload => {
          this.parents = payload.parents
        })
        .receive('error', err => {
          console.log(err)
        })
    },

    validate () {
      this.$validator.validateAll().then(() => {
        this.save()
      }).catch(err => {
        console.log(err)
        alert('Feil i skjema', 'Vennligst se over og rett feil i rødt')
        this.loading = false
      })
    },

    async save () {
      try {
        nprogress.start()
        await pageAPI.createPage(this.page)
        nprogress.done()
        this.$toast.success({message: 'Side opprettet'})
        this.$router.push({ name: 'pages' })
      } catch (err) {
        showError(err)
      }
    }
  }
}
</script>
