<template>
  <div class="create-post">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="section mb-0">Opprett fragment</h5>
        </div>
        <div
          v-if="page"
          class="card-body">
          <KInputSelect
            v-validate="'required'"
            v-model="page.language"
            :value="page.language"
            :options="[
              { name: 'English', value: 'en' },
              { name: 'Norsk', value: 'no' }
            ]"
            :has-error="errors.has('page[language]')"
            :error-text="errors.first('page[language]')"
            name="page[language]"
            label="Språk"
            data-vv-name="page[language]"
            data-vv-value-path="innerValue"
          />

          <KInput
            v-validate="'required'"
            v-model="page.parent_key"
            :value="page.parent_key"
            :has-error="errors.has('page[parent_key]')"
            :error-text="errors.first('page[parent_key]')"
            name="page[parent_key]"
            type="text"
            label="Hovednøkkel"
            placeholder="Hovednøkkel"
            data-vv-name="page[parent_key]"
            data-vv-value-path="innerValue"
          />

          <KInput
            v-validate="'required'"
            v-model="page.key"
            :value="page.key"
            :has-error="errors.has('page[key]')"
            :error-text="errors.first('page[key]')"
            name="page[key]"
            type="text"
            label="Nøkkel"
            placeholder="Nøkkel"
            data-vv-name="page[key]"
            data-vv-value-path="innerValue"
          />

          <Villain
            :value="page.data"
            label="Innhold"
            @input="page.data = $event"
          />

          <button
            :disabled="!!loading"
            class="btn btn-secondary"
            @click="validate">
            Lagre fragment
          </button>

          <router-link
            :disabled="!!loading"
            :to="{ name: 'pagefragments' }"
            class="btn btn-outline-secondary">
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

  props: {
    pageId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      loading: 0,
      parents: [],
      page: null
    }
  },

  inject: [
    'adminChannel'
  ],

  async created () {
    const p = await pageFragmentAPI.getPageFragment(this.pageId)
    this.page = {...p}
  },

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
        await pageFragmentAPI.updatePageFragment(this.pageId, this.page)
        nprogress.done()
        this.$toast.success({message: 'Fragment oppdatert'})
        this.$router.push({ name: 'pagefragments' })
      } catch (err) {
        showError(err)
      }
    }
  }
}
</script>
