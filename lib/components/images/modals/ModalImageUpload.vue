<template>
  <modal
    :chrome="false"
    :large="true"
    :show="showModal"
    @cancel="closeModal"
    @ok="closeModal"
    v-if="showModal"
  >
    <div class="card mb-3">
      <div class="card-header text-center">
        <h5 class="section mb-0">Last opp bilder til {{ imageSeries.name }}</h5>
      </div>
      <div class="card-body">
        <div class="example-drag">
          <div class="upload">
            <table class="table table-bordered" v-if="files.length">
              <tr v-for="(file, index) in files" :key="file.id">
                <td>
                  <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
                </td>
                <td>{{file.name}}</td>
                <td>{{file.size | formatSize}}</td>
                <td v-if="file.error === 'denied'"><i class="fal fa-fw fa-exclamation-circle text-danger"></i> 404</td>
                <td v-else-if="file.success"><i class="fal fa-fw fa-check text-success"></i></td>
                <td v-else-if="file.active"><i class="fal fa-fw fa-cog fa-spin"></i></td>
                <td v-else></td>
              </tr>
            </table>
            <div
              class="d-flex justify-content-center p-5 mt-0 mb-4 bg-light"
              v-else
            >
              <h5 class="text-center">Slipp filene dine her for å laste opp<br/><br/>eller</h5>
            </div>
            <div class="d-flex justify-content-center">
              <div class="example-btn">
                <file-upload
                  class="btn btn-primary"
                  :post-action="`/admin/api/images/upload/image_series/${imageSeries.id}`"
                  :headers="{'authorization': getToken()}"
                  :multiple="true"
                  :drop="true"
                  name="image"
                  accept="image/*"
                  v-model="files"
                  @input-filter="inputFilter"
                  @input-file="inputFile"
                  ref="upload">
                  <i class="fa fa-plus"></i>
                  Velg filer
                </file-upload>
                <button type="button" :disabled="!files.length" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                  Start opplasting
                </button>
                <button type="button" class="btn btn-danger" @click.prevent="$refs.upload.active = false" v-else>
                  <i class="fa fa-stop" aria-hidden="true"></i>
                  Stopp opplasting
                </button>
                <button type="button" :disabled="$refs.upload && $refs.upload.active" class="btn btn-primary" @click.prevent="closeModal">
                  <i class="fa fa-window-close" aria-hidden="true"></i>
                  Lukk vindu
                </button>
              </div>
            </div>

            <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
              <h3>Slipp filene her for å laste opp</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from 'vuex'
import Modal from '../../Modal'

export default {
  components: {
    Modal
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    imageSeries: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      files: []
    }
  },

  methods: {
    closeModal () {
      this.files = []
      this.$emit('close')
    },

    getToken () {
      return `Bearer: ${localStorage.getItem('token')}`
    },

    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // Uploaded successfully
        if (newFile.success !== oldFile.success) {
          if (newFile.response.status === '200') {
            this.storeImage(newFile.response.image)
            console.log('success', newFile.success, newFile)
          }
        }
        // Upload error
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
        }
      }
    },

    inputFilter (newFile, oldFile, prevent) {
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },

    ...mapActions('images', [
      'storeImage'
    ])
  }
}
</script>

<style>
.example-drag label.btn {
  margin-bottom: 0;
  margin-right: 0;
}

.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}

.example-drag .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
