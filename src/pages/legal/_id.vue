<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    h1(class="text-ele" style="margin-bottom: 16px; line-height: 1.0;" v-text="page.title")
    a-card
      .page-content(v-html="page.content")
</template>

<script>
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'
export default {
  data: () => ({
    page: null,
  }),
  head() {
    return new Meta(this.page.title, this.page.content)
  },
  asyncData({ $axios, params, error }) {
    return $axios.get(process.env.cmsURL + `/api/items/pages?filter[slug][eq]=${params.id}&fields=*.*`)
      .then((postResponse) => {
        const postData = postResponse.data.data[0]
        if (!postData) {
          error('Post not found!')
        }
        return { page: postData }
      })
      .catch(err => handleErrorBlock(err, error))
  },
}
</script>

<style lang="less">
.page-content blockquote {
  font-style: italic;
  color: @shade5;
  line-height: 0.5;
  position: relative;
  padding-left: 1.5rem;
  &:before {
    background-color: @shade5;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 2px;
  }
}
</style>
