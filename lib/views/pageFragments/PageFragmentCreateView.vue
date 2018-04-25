<template>
  <div class="create-post">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="section mb-0">Opprett fragment</h5>
        </div>
        <div class="card-body">
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
            v-model="page.parent_key"
            :value="page.parent_key"
            name="page[parent_key]"
            type="text"
            label="Hovednøkkel"
            placeholder="Hovednøkkel"
            v-validate="'required'"
            data-vv-name="page[parent_key]"
            data-vv-value-path="innerValue"
            :has-error="errors.has('page[parent_key]')"
            :error-text="errors.first('page[parent_key]')"
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

          <Villain
            :value="page.data"
            label="Innhold"
            @input="page.data = $event"
          />

          <button :disabled="!!loading" @click="validate" class="btn btn-secondary">
            Lagre fragment
          </button>

          <router-link :disabled="!!loading" :to="{ name: 'pagefragments' }" class="btn btn-outline-secondary">
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
import { pageFragmentAPI } from 'kurtz/lib/api/pageFragment'

export default {
  data () {
    return {
      loading: 0,
      parents: [],
      page: {
        key: '',
        data: '',
        language: 'en'
      }
    }
  },

  inject: [
    'adminChannel'
  ],

  methods: {
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
        await pageFragmentAPI.createPageFragment(this.page)
        nprogress.done()
        this.$toast.success({message: 'Fragment opprettet'})
        this.$router.push({ name: 'pagefragments' })
      } catch (err) {
        showError(err)
      }
    }
  }
}
</script>
