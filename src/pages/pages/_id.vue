<template lang="pug">
div
  .section.hero
    .hero-body
      .container
        .title(v-text="page.title")
  .section: .container
    .box
      .content.page-content(v-html="htmlContent")
</template>

<script>
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'
import gql from 'graphql-tag'
import marked from 'marked'
const query = gql`query GetPost($uid: String!) {
  page: getPost(uid: $uid) {
    id
    uid
    title
    slogan
    content
    state
    creationDate
    modificationDate
    startDate
    endDate
    cover {
      original
    }
  }
}`

export default {
  data: () => ({
    page: null,
  }),
  head() {
    return new Meta(this.page.title, this.page.content)
  },
  computed: {
    htmlContent() {
      return marked(this.page.content)
    }
  },
  async asyncData({ params, store, error, app }) {
    const page = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(({ data }) => data?.page)
      .catch(err => handleErrorBlock(err, error))
    if (!page) {
      return error({ statusCode: 404, message: 'Post not found' })
    }
    const image = page.cover?.original
    if (image) {
      store.commit('setBackground', { source: image })
    }
    return { page }
  },
}
</script>

<style lang="scss">
.page-content blockquote {
  font-style: italic;
  color: $grey-lighter;
  line-height: 0.5;
  position: relative;
  padding-left: 1.5rem;
  &:before {
    background-color: $grey-lighter;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 2px;
  }
}
</style>
