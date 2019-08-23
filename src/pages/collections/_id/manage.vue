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
        client-only: markdown-editor(v-model="value.description")
      a-form-item(label="Cover Image")
        background-upload(:src="value.coverURL")
      a-button.is-pulled-right(
        size="large"
        html-type="submit"
        type="primary"
      ) Submit
  a-card.ele3(title="Levels" style="margin-top: 3rem;")
    draggable.level-list(v-model="value.levels")
      .level-list-item(
        v-for="level in value.levels"
        :style="bgStyle(level)"
        :key="level.id"
      )
        b(v-text="level.title")
        span(v-text="' by ' + (level.owner.name || level.owner.uid)")
        .is-pulled-right
          .tag.listing(v-if="level.published !== true"  v-text="level.published === false ? 'Private' : 'Unlisted'")
          nuxt-link.tag.manage(
            v-if="$store.state.user && ($store.state.user.id !== level.owner.id)"
            :to="{ name: 'levels-id-manage', params: { id: level.uid } }"
          ) Manage
    a-auto-complete(placeholder="Level UID" @search="levelSearch").level-search
      template(slot="dataSource")
        a-select-option(v-for="item in searchResults" :key="item.id + ''") {{item.title}}
      a-input
        a-button(slot="suffix")
          font-awesome-icon(icon="plus")
</template>

<script>
import draggable from 'vuedraggable'
import { handleErrorBlock } from '../../../plugins/antd'
import UploadMixin from '@/mixins/upload'
import BackgroundUpload from '@/components/BackgroundUpload.vue'

export default {
  name: 'CollectionManagement',
  components: {
    BackgroundUpload, draggable,
  },
  mixins: [UploadMixin('covers', 'image/*')],
  data() {
    return {
      value: null,
      searchResults: []
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
  },
  methods: {
    levelSearch(key) {
      return this.$axios.get('/tags/levels', { params: { search: key } })
        .then((res) => {
          this.searchResults = res.data
        })
    },
    bgStyle(level) {
      const attrs = {
        maxHeight: 54,
        fitMode: 'crop',
        cropMode: 'entropy',
        brightness: -20,
      }
      const url = this.$img(level.bundle.background, attrs)
      return { backgroundImage: `url(${url})` }
    }
  }
}
</script>

<style lang="less">
.level-list {
  border-radius: @border-radius-base;
  border: 1px solid @shade5;
  margin-bottom: 16px;
  .level-list-item {
    padding: 1rem;
    border-bottom: 1px solid @shade4;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    // backdrop-filter: blur(1px); compatibility issue, not working on firefox
    .tag {
      margin-right: .5rem;
      margin-left: .5rem;
      &.listing {
        background-color: @error-color;
      }
      &.manage {
        background-color: @shade1;
      }
    }
  }
}
.level-search {
  width: 100%;
  .ant-input-suffix {
    right: 0;
    button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
