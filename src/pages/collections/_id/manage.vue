<template lang="pug">
.section: .container
  a-card.ele3(title="Listing")
    a-form
      a-form-item(label="UID")
        a-input(v-model="value.uid")
      a-form-item(label="Title")
        a-input(v-model="value.title")
      a-form-item(label="Brief")
        a-textarea(:rows="4" v-model="value.brief")
      a-form-item(label="Description")
        no-ssr: markdown-editor(v-model="value.description")
      a-form-item(label="Cover Image")
        background-upload(:src="value.coverURL")
      a-button.is-pulled-right(
        size="large"
        html-type="submit"
        type="primary"
      ) Submit
  a-card.ele3(title="Levels" style="margin-top: 3rem;")
</template>

<script>
import { handleErrorBlock } from '../../../plugins/antd'
import UploadMixin from '@/mixins/upload'
import BackgroundUpload from '@/components/BackgroundUpload.vue'

export default {
  name: 'CollectionManagement',
  components: {
    BackgroundUpload,
  },
  mixins: [UploadMixin('covers', 'image/*')],
  data() {
    return {
      value: null
    }
  },
  asyncData({ $axios, params, error, store }) {
    return $axios.get('/collections/' + params.id)
      .then((response) => {
        return {
          value: response.data
        }
      })
      .catch(err => handleErrorBlock(err, error))
  }
}
</script>
